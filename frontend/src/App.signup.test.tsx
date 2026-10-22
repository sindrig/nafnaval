import { act, fireEvent, render, wait } from '@testing-library/react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import App from './App'
import reducer from './store/reducer'
import i18n from './i18n'
import { renderSignupCaptcha } from './wafCaptcha'

jest.mock('./wafCaptcha', () => ({ renderSignupCaptcha: jest.fn() }))

const captchaMock = renderSignupCaptcha as jest.Mock
const stateId = '00000000-0000-4000-8000-000000000001'
const server = setupServer(
  rest.get('/env.json', (_req, res, ctx) =>
    res(
      ctx.json({
        baseURL: '/api',
        signupsEnabled: true,
        signupCaptcha: {
          scriptUrl: 'https://example.awswaf.com/jsapi.js',
          apiKey: 'key',
        },
      }),
    ),
  ),
  rest.get(`/api/state/${stateId}`, (_req, res, ctx) =>
    res(ctx.json({ Remaining: ['Anna'], Selected: [], Rejected: [] })),
  ),
)

beforeAll(async () => {
  server.listen({ onUnhandledRequest: 'error' })
  await i18n.changeLanguage('en')
})
beforeEach(() => {
  jest.resetAllMocks()
  window.history.replaceState({}, '', '/')
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

async function signupForm() {
  const store = createStore(reducer, applyMiddleware(thunk))
  const view = render(
    <MuiThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>,
  )
  await wait(() =>
    expect(view.getByText('Submit').closest('button')).not.toBeDisabled(),
  )
  fireEvent.change(view.getByTestId('your-email-input'), {
    target: { value: 'parent@example.com' },
  })
  fireEvent.change(view.getByTestId('partner-email-input'), {
    target: { value: 'partner@example.com' },
  })
  const submit = async () => {
    await act(async () => {
      fireEvent.submit(view.container.querySelector('form')!)
    })
  }
  return { ...view, store, submit }
}

test('a real signup 429 clears CAPTCHA success and leaves the form recoverable', async () => {
  const requests: string[] = []
  let finishRequest = () => {}
  const pendingRequest = new Promise<void>((resolve) => {
    finishRequest = resolve
  })
  server.use(
    rest.put('/api/state/', async (req, res, ctx) => {
      requests.push(req.headers.get('X-Aws-Waf-Token') || '')
      await pendingRequest
      return res(
        ctx.status(429),
        ctx.json({ error: 'Too many signups. Please try again later.' }),
      )
    }),
  )
  const callbacks: Array<(token: string) => void> = []
  const containers: HTMLElement[] = []
  captchaMock.mockImplementation(async (container, _config, onSuccess) => {
    containers.push(container)
    callbacks.push((token) => {
      container.textContent = 'Success! You will be redirected shortly.'
      onSuccess(token)
    })
  })
  const view = await signupForm()

  await view.submit()
  expect(captchaMock).toHaveBeenCalledTimes(1)
  act(() => callbacks[0]('verified-token'))
  await wait(() => expect(requests).toEqual(['verified-token']))
  expect(view.store.getState().names.initializing).toBe(true)
  expect(view.getByText('Loading...')).toBeVisible()
  expect(view.getByText('Submit').closest('button')).toBeDisabled()
  expect(view.queryByText(/redirected shortly/)).not.toBeInTheDocument()

  finishRequest()
  await wait(() => expect(view.getByRole('alert')).toBeVisible())
  expect(view.getByRole('alert')).toHaveTextContent(
    'use the links in your email',
  )
  expect(view.getByRole('alert')).toHaveTextContent('once every 24 hours')
  expect(view.store.getState().names.initializing).toBe(false)
  await wait(() =>
    expect(
      view.container.querySelector('._loading_overlay_overlay'),
    ).not.toBeInTheDocument(),
  )
  expect(view.queryByText(/redirected shortly/)).not.toBeInTheDocument()
  expect(view.getByTestId('your-email-input')).toHaveValue('parent@example.com')
  expect(view.getByTestId('partner-email-input')).toHaveValue(
    'partner@example.com',
  )
  expect(view.getByText('Submit').closest('button')).not.toBeDisabled()
  expect(window.location.pathname).toBe('/')

  // Retrying clears the old error and requires a new CAPTCHA/token.
  await view.submit()
  expect(view.queryByRole('alert')).not.toBeInTheDocument()
  expect(captchaMock).toHaveBeenCalledTimes(2)
  expect(containers[0].isConnected).toBe(false)
  expect(containers[1]).not.toBe(containers[0])
  act(() => callbacks[0]('stale-token'))
  expect(requests).toEqual(['verified-token'])

  server.use(
    rest.put('/api/state/', (req, res, ctx) => {
      requests.push(req.headers.get('X-Aws-Waf-Token') || '')
      return res(ctx.json({ stateId }))
    }),
  )
  act(() => callbacks[1]('fresh-token'))
  await wait(() => expect(window.location.pathname).toBe(`/${stateId}`))
  await wait(() => expect(view.store.getState().names.initializing).toBe(false))
  expect(requests).toEqual(['verified-token', 'fresh-token'])
  expect(view.store.getState().names.error).toBeNull()
})

test('a non-JSON WAF rejection can be dismissed without losing the form', async () => {
  server.use(
    rest.put('/api/state/', (_req, res, ctx) =>
      res(ctx.status(405), ctx.text('<html>CAPTCHA required</html>')),
    ),
  )
  captchaMock.mockImplementation(async (_container, _config, onSuccess) => {
    onSuccess('expired-token')
  })
  const view = await signupForm()

  await view.submit()
  await wait(() => expect(view.getByRole('alert')).toBeVisible())
  expect(view.getByRole('alert')).toHaveTextContent(
    'Signup could not be completed. Please try again.',
  )
  expect(view.store.getState().names.initializing).toBe(false)

  fireEvent.click(view.getByText('Dismiss'))
  expect(view.queryByRole('alert')).not.toBeInTheDocument()
  expect(view.getByTestId('your-email-input')).toHaveValue('parent@example.com')
  expect(view.getByText('Submit').closest('button')).not.toBeDisabled()
})

import { render, wait } from '@testing-library/react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import React from 'react'
import { Provider } from 'react-redux'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import App from './App'
import store from './store'

const server = setupServer(
  rest.get('/env.json', (req, res, ctx) => {
    return res(ctx.json({ baseURL: '/api', signupsEnabled: false }))
  }),
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

test('paused registration does not prevent loading the app', async () => {
  const { getByRole, getByText } = render(
    <MuiThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>,
  )

  await wait(() => expect(getByRole('status')).toBeInTheDocument())
  expect(getByText('Submit').closest('button')).toBeDisabled()
})

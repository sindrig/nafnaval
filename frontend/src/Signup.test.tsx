import React from 'react'
import { act, fireEvent, render, wait } from '@testing-library/react'
import { Signup } from './Signup'
import { getSignupConfig } from './api'
import { renderSignupCaptcha } from './wafCaptcha'

jest.mock('./api', () => ({ getSignupConfig: jest.fn() }))
jest.mock('./wafCaptcha', () => ({ renderSignupCaptcha: jest.fn() }))
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const captcha = {
  scriptUrl: 'https://example.awswaf.com/jsapi.js',
  apiKey: 'key',
}
const configMock = getSignupConfig as jest.Mock
const captchaMock = renderSignupCaptcha as jest.Mock

beforeEach(() => {
  jest.resetAllMocks()
  configMock.mockResolvedValue({ enabled: true, captcha })
})

async function submit(signUp: jest.Mock) {
  const view = render(
    <Signup signUp={signUp} initializing={false} clearError={jest.fn()} />,
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
  const form = view.container.querySelector('form')
  if (!form) throw new Error('Signup form is missing')
  await act(async () => {
    fireEvent.submit(form)
  })
  return view
}

test('signup waits for successful AWS CAPTCHA verification', async () => {
  const signUp = jest.fn()
  let complete = (token: string) => {}
  captchaMock.mockImplementation(async (_container, _config, onSuccess) => {
    complete = onSuccess
  })

  await submit(signUp)
  await wait(() => expect(captchaMock).toHaveBeenCalledTimes(1))
  expect(signUp).not.toHaveBeenCalled()

  act(() => complete('verified-waf-token'))

  expect(signUp).toHaveBeenCalledWith(
    'parent@example.com',
    'partner@example.com',
    'female',
    'verified-waf-token',
  )
})

test('failed CAPTCHA does not submit a signup', async () => {
  const signUp = jest.fn()
  captchaMock.mockRejectedValue(new Error('SDK unavailable'))

  const view = await submit(signUp)

  await wait(() => expect(view.getByRole('alert')).toBeInTheDocument())
  expect(signUp).not.toHaveBeenCalled()
  expect(view.getByText('Submit').closest('button')).not.toBeDisabled()
})

test('a failed CAPTCHA is removed and stale callbacks cannot submit', async () => {
  const signUp = jest.fn()
  let complete = (token: string) => {}
  let fail = () => {}
  captchaMock.mockImplementation(
    async (container, _config, onSuccess, onError) => {
      container.textContent = 'Verification puzzle'
      complete = onSuccess
      fail = onError
    },
  )
  const view = await submit(signUp)
  expect(view.getByText('Verification puzzle')).toBeVisible()

  act(() => fail())
  expect(view.queryByText('Verification puzzle')).not.toBeInTheDocument()
  expect(view.getByRole('alert')).toBeVisible()
  expect(view.getByText('Submit').closest('button')).not.toBeDisabled()
  act(() => complete('stale-token'))
  expect(signUp).not.toHaveBeenCalled()
})

test('paused signup never submits or loads CAPTCHA', async () => {
  configMock.mockResolvedValue({ enabled: false, captcha })
  const signUp = jest.fn()
  const view = render(
    <Signup signUp={signUp} initializing={false} clearError={jest.fn()} />,
  )

  await wait(() => expect(view.getByRole('status')).toBeInTheDocument())
  fireEvent.click(view.getByText('Submit'))

  expect(view.getByText('Submit').closest('button')).toBeDisabled()
  expect(signUp).not.toHaveBeenCalled()
  expect(captchaMock).not.toHaveBeenCalled()
})

test('configuration failure keeps signup disabled', async () => {
  configMock.mockRejectedValue(new Error('Configuration unavailable'))
  const signUp = jest.fn()
  const view = render(
    <Signup signUp={signUp} initializing={false} clearError={jest.fn()} />,
  )

  await wait(() => expect(view.getByRole('alert')).toBeInTheDocument())

  expect(view.getByText('Submit').closest('button')).toBeDisabled()
  expect(signUp).not.toHaveBeenCalled()
})

test('explicitly configured local signup does not require AWS CAPTCHA', async () => {
  configMock.mockResolvedValue({ enabled: true, captcha: null })
  const signUp = jest.fn()

  await submit(signUp)

  await wait(() =>
    expect(signUp).toHaveBeenCalledWith(
      'parent@example.com',
      'partner@example.com',
      'female',
    ),
  )
  expect(captchaMock).not.toHaveBeenCalled()
})

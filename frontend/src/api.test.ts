import axios from 'axios'
import { createState } from './api'

jest.mock('axios')
const put = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(axios.get as jest.Mock).mockResolvedValue({ data: { baseURL: '/api' } })
  ;(axios.create as jest.Mock).mockReturnValue({ put })
})

test('signup sends the CAPTCHA token in the header inspected by AWS WAF', async () => {
  put.mockResolvedValue({ data: { stateId: 'new-state' } })

  const response = await createState(
    'parent@example.com',
    'partner@example.com',
    'both',
    'verified-token',
  )

  expect(put).toHaveBeenCalledWith(
    '/state/',
    {
      email1: 'parent@example.com',
      email2: 'partner@example.com',
      gender: 'both',
    },
    { headers: { 'X-Aws-Waf-Token': 'verified-token' } },
  )
  expect(response).toEqual({ stateId: 'new-state' })
})

test.each([{}, { response: { data: '<html>CAPTCHA required</html>' } }])(
  'non-JSON or CORS-blocked WAF responses produce a recoverable error',
  async (error) => {
    put.mockRejectedValue(error)

    const response = await createState(
      'parent@example.com',
      'partner@example.com',
      'both',
      'expired-token',
    )

    expect(response).toEqual({
      error: 'Signup could not be completed. Please try again.',
    })
  },
)

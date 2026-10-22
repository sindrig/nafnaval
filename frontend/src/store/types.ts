export interface Environment {
  baseURL: string
  signupsEnabled?: boolean
  signupCaptcha?: {
    scriptUrl: string
    apiKey: string
  } | null
}

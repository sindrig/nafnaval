export interface CaptchaConfig {
  scriptUrl: string
  apiKey: string
}

declare global {
  interface Window {
    AwsWafCaptcha?: {
      renderCaptcha: (
        container: HTMLElement,
        options: {
          apiKey: string
          onSuccess: (token: string) => void
          onError: () => void
        },
      ) => void
    }
  }
}

let scriptLoading: Promise<void> | undefined

const loadScript = (url: string): Promise<void> => {
  if (window.AwsWafCaptcha) return Promise.resolve()
  if (scriptLoading) return scriptLoading

  scriptLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      script.remove()
      scriptLoading = undefined
      reject(new Error('Could not load AWS WAF CAPTCHA'))
    }
    document.head.appendChild(script)
  })
  return scriptLoading
}

export const renderSignupCaptcha = async (
  container: HTMLElement,
  config: CaptchaConfig,
  onSuccess: (token: string) => void,
  onError: () => void,
) => {
  await loadScript(config.scriptUrl)
  if (!container.isConnected) return
  if (!window.AwsWafCaptcha) {
    scriptLoading = undefined
    throw new Error('AWS WAF CAPTCHA is unavailable')
  }
  window.AwsWafCaptcha.renderCaptcha(container, {
    apiKey: config.apiKey,
    onSuccess,
    onError,
  })
}

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import './index.css'
import App from './App'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as serviceWorker from './serviceWorker'

import './i18n'

import { AwsRum, AwsRumConfig } from 'aws-rum-web'

try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    guestRoleArn:
      'arn:aws:iam::525422706348:role/RUM-Monitor-eu-west-1-525422706348-3259537074561-Unauth',
    identityPoolId: 'eu-west-1:31f7826f-9864-47b9-96a6-fb13dc0b26a3',
    endpoint: 'https://dataplane.rum.eu-west-1.amazonaws.com',
    telemetries: ['performance', 'errors', 'http'],
    allowCookies: true,
    enableXRay: false,
  }

  const APPLICATION_ID: string = '6adac9fc-1583-46ad-97eb-139b5dee1ec6'
  const APPLICATION_VERSION: string = '1.0.0'
  const APPLICATION_REGION: string = 'eu-west-1'

  new AwsRum(APPLICATION_ID, APPLICATION_VERSION, APPLICATION_REGION, config)
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

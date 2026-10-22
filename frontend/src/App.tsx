import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { connect, ConnectedProps } from 'react-redux'
import { useTranslation } from 'react-i18next'
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay'
import { IStoreState } from './store/reducer'
import { UUID_REGEX } from './constants'
import Selection from './Selection'
import About from './About'
import Signup from './Signup'
import NavBar from './NavBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { clearError } from './store/names/actions'
import './App.css'

function mapStateToProps({ names: { initializing, error } }: IStoreState) {
  return { initializing, error }
}

const connector = connect(mapStateToProps, { clearError })

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  initializing: boolean
  error: string | null
}

const idMatch = `:id(${UUID_REGEX})`

const App: React.FC<Props> = ({ initializing, error, clearError }: Props) => {
  const { t } = useTranslation()
  return (
    <Router>
      <CssBaseline />
      <LoadingOverlay active={initializing} spinner text={t('Loading...')}>
        <NavBar />
        {error && (
          <Container maxWidth="sm" className="error-banner" role="alert">
            <Typography color="error">{t(error)}</Typography>
            <Button onClick={clearError}>{t('Dismiss')}</Button>
          </Container>
        )}
        <div className="app-container">
          <Switch>
            <Route path={`/${idMatch}`}>
              <Selection />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/">
              <Signup />
            </Route>
          </Switch>
        </div>
      </LoadingOverlay>
    </Router>
  )
}

export default connector(App)

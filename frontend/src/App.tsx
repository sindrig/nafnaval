import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import { IStoreState } from './store/reducer';
import { UUID_REGEX } from './constants';
import Selection from './Selection';
import Signup from './Signup';
import NavBar from './NavBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';

function mapStateToProps({ names: { initializing }}: IStoreState) {
  return { initializing };
}

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  initializing: boolean
}

const idMatch = `:id(${UUID_REGEX})`;

const App: React.FC<Props> = ({ initializing }: Props) => {
  const { t } = useTranslation();
  return (
      <Router>
        <CssBaseline />
        <LoadingOverlay
          active={initializing}
          spinner
          text={t('Loading...')}
        >
          <NavBar />
          <div className="app-container">
            <Switch>
              <Route path={`/${idMatch}`}>
                <Selection />
              </Route>
              <Route path="/about">
                <div>TODO ABOUT</div>
              </Route>
              <Route path="/">
                <Signup />
              </Route>
            </Switch>
           </div>
        </LoadingOverlay>
    </Router>
    );
}

export default connector(App);

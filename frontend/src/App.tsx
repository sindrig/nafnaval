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
import Selection from './Selection';
import Signup from './Signup';
import NavBar from './NavBar';
import './App.css';

function mapStateToProps(state: IStoreState) {
// function mapStateToProps({ names: { initializing } }: IStoreState) {
  return { initializing: state.names.initializing };
}

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  initializing: boolean
}


const App: React.FC<Props> = (props: Props) => {
  const { i18n, t } = useTranslation();
  return (
      <Router>
        <div>
          <LoadingOverlay
            active={props.initializing}
            spinner
            text={t('Loading...')}
          >
            <NavBar />
            <div className="language-selector">
              <button onClick={() => i18n.changeLanguage('is')}>is</button>
              <button onClick={() => i18n.changeLanguage('en')}>en</button>
            </div>
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})">
                <Selection />
              </Route>
              <Route path="/">
                <Signup />
              </Route>
            </Switch>
          </LoadingOverlay>
        </div>
      </Router>
    );
}

export default connector(App);

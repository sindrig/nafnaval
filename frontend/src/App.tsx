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
import ShowSelection, { SelectionType} from './ShowSelection';
import CssBaseline from '@material-ui/core/CssBaseline';
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

const idMatch = `:id(${UUID_REGEX})`;

const App: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  return (
      <Router>
        <CssBaseline />
        <LoadingOverlay
          active={props.initializing}
          spinner
          text={t('Loading...')}
        >
          <NavBar />
          <div className="app-container">
            <Switch>
              <Route path={`/${idMatch}/selected`}>
                <ShowSelection selection={SelectionType.selected} />
              </Route>
              <Route path={`/${idMatch}/rejected`}>
                <ShowSelection selection={SelectionType.rejected} />
              </Route>
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

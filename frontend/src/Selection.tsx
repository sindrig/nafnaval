import React, { useEffect } from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import { Prompt } from 'react-router'
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, withRouter, RouteComponentProps } from "react-router-dom";
import { Dispatch, Action, bindActionCreators } from 'redux';
import { List } from 'immutable';
import { IStoreState } from './store/reducer';
import { getNames as getNamesAction } from './store/names/actions';
import { NameSelection } from './store/names/types';
import SelectionView from './SelectionView';
import ShowSelection, { SelectionType } from './ShowSelection';


interface SelectionProps extends RouteComponentProps<any>{
  selections: List<NameSelection>
  getNames: (id: string) => (dispatch: Dispatch<Action>) => Promise<void>
}

function mapStateToProps({ names: { selections }}: IStoreState) {
  return { selections };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    getNames: bindActionCreators(getNamesAction, dispatch)
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

const Selection: React.FC<SelectionProps> = ({getNames, selections, match}: SelectionProps) => {
  const { t } = useTranslation();
  const { id } = useParams();
  useEffect(() => {getNames(id!)}, [getNames, id]);
  useEffect(() => {
    if (selections.size > 0) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }}, [selections.size]
  );
  return (
    <React.Fragment>
      <Prompt
        when={selections.size > 0}
        message={t('Unsaved?')}
      />

      <Switch>
        <Route path={`${match.path}/selected`}>
          <ShowSelection selection={SelectionType.selected} />
        </Route>
        <Route path={`${match.path}/rejected`}>
          <ShowSelection selection={SelectionType.rejected} />
        </Route>
        <Route path={`${match.path}/`}>
          <SelectionView />
        </Route>
      </Switch>
    </React.Fragment>
  )
}



export default withRouter(connector(Selection))

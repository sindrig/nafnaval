import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch, Action, bindActionCreators } from 'redux';
import { List } from 'immutable';
import { IStoreState } from './store/reducer';
import { getNames as getNamesAction } from './store/names/actions';
import Name from './SelectionName';
import SelectionSave from './SelectionSave';
import NavBar from './NavBar';
import './Selection.css'


interface SelectionProps extends RouteComponentProps<any> {
  remaining: List<string>
  getNames: (id: string) => (dispatch: Dispatch<Action>) => Promise<void>
}


const Selection: React.FC<SelectionProps> = ({getNames, remaining, match: { params }}: SelectionProps) => {
  useEffect(() => {getNames(params.id)}, [getNames, params.id]);
  if ( remaining.size === 0 ) {
    return <div>All done... TODO</div>
  }
  return (
    <div className="selection">
      <NavBar />
      <SelectionSave />
      <Name name={remaining.get(0) || ''} />
    </div>
  )
}


function mapStateToProps({ names: { remaining }}: IStoreState) {
  return { remaining };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    getNames: bindActionCreators(getNamesAction, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Selection)
) as React.ComponentClass<{}>;

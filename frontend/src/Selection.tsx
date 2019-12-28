import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import { Dispatch, Action, bindActionCreators } from 'redux';
import { List } from 'immutable';
import { IStoreState } from './store/reducer';
import { getNames as getNamesAction } from './store/names/actions';
import Name from './SelectionName';
import './Selection.css'


interface SelectionProps {
  remaining: List<string>
  getNames: (id: string) => (dispatch: Dispatch<Action>) => Promise<void>
}


const Selection: React.FC<SelectionProps> = ({getNames, remaining}: SelectionProps) => {
  const { id } = useParams();
  useEffect(() => {getNames(id!)}, [getNames, id]);
  if ( remaining.size === 0 ) {
    return <div>All done... TODO</div>
  }
  return (
    <div className="selection">
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

export default connect(mapStateToProps, mapDispatchToProps)(Selection)

import React, { useEffect } from 'react';
import { Prompt } from 'react-router'
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { Dispatch, Action, bindActionCreators } from 'redux';
import { List } from 'immutable';
import { IStoreState } from './store/reducer';
import { getNames as getNamesAction } from './store/names/actions';
import { NameSelection } from './store/names/types';
import SelectionName from './SelectionName';
import './Selection.css'


interface SelectionProps {
  remaining: List<string>
  selections: List<NameSelection>
  getNames: (id: string) => (dispatch: Dispatch<Action>) => Promise<void>
}


const Selection: React.FC<SelectionProps> = ({getNames, remaining, selections}: SelectionProps) => {
  const { t } = useTranslation();
  const { id } = useParams();
  useEffect(() => {getNames(id!)}, [getNames, id]);
  useEffect(() => {
    if (selections.size > 0) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = null
    }}, [selections.size]
  )
  if ( remaining.size === 0 ) {
    return <div>All done... TODO</div>
  }
  return (
    <React.Fragment>
      <Prompt
        when={selections.size > 0}
        message={t('Unsaved?')}
      />
      <SelectionName name={remaining.get(0)!} />
    </React.Fragment>
  )
}


function mapStateToProps({ names: { remaining, selections }}: IStoreState) {
  return { remaining, selections };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    getNames: bindActionCreators(getNamesAction, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Selection)

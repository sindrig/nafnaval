import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch, Action, bindActionCreators } from 'redux';
import { IStoreState } from './store/reducer';
import { saveSelections } from './store/names/actions';
import { useTranslation } from 'react-i18next';
import { List } from 'immutable';
import { NameSelection } from './store/names/types';
import './SelectionName.css'

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    save: bindActionCreators(saveSelections, dispatch),
  };
}

function mapStateToProps({ names: { selections, stateId }}: IStoreState) {
  return { selections, stateId };
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  save: Function
  selections: List<NameSelection>
}

const SelectionName: React.FC<Props> = ({ save, selections, stateId }: Props) => {
  const { t } = useTranslation();
  if ( selections.size === 0 || !stateId ) {
    return null;
  }
  return (
    <div className="selection-save-container">
      <button className="selection-button selection-save" onClick={() => save(stateId!, selections)}>{t('Save and continue')}</button>
    </div>
  )
}


export default connector(SelectionName)

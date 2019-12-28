import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch, Action, bindActionCreators } from 'redux';
import { rejectName, selectName } from './store/names/actions';
import { useTranslation } from 'react-i18next';
import './SelectionName.css'

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    select: bindActionCreators(selectName, dispatch),
    reject: bindActionCreators(rejectName, dispatch)
  };
}

const connector = connect(null, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  select: Function
  reject: Function
  name: string
}

const SelectionName: React.FC<Props> = ({ name, reject, select }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="selection-name-container">
      <div className="selection-name"><span>{name}</span></div>
      <button className="selection-button selection-select" onClick={() => select(name)}>{t('Select')}</button>
      <button className="selection-button selection-reject" onClick={() => reject(name)}>{t('Reject')}</button>
    </div>
  )
}


export default connector(SelectionName)

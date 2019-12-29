import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch, Action, bindActionCreators } from 'redux';
import { IStoreState } from './store/reducer';
import { moveName } from './store/names/actions';
import { Bucket } from './store/names/types';
import { useTranslation } from 'react-i18next';
import './SelectionView.css'

function mapStateToProps({ names: { remaining, progress }}: IStoreState) {
  return { name: remaining.get(0), progress };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    select: bindActionCreators((name) => moveName(name, Bucket.Remaining, Bucket.Selected), dispatch),
    reject: bindActionCreators((name) => moveName(name, Bucket.Remaining, Bucket.Rejected), dispatch)
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  select: Function
  reject: Function
  name?: string
  progress: number
}

const SelectionView: React.FC<Props> = ({ name, reject, select, progress }: Props) => {
  const { t } = useTranslation();
  if (!name) {
    if (progress) {
      return <Redirect to="/done" />
    }
    return <div>{t('Loading...')}</div>
  }
  return (
    <div className="selection-name-container">
      <div className="selection-name"><span>{name}</span></div>
      <button className="selection-button selection-select" onClick={() => select(name)}>{t('Select')}</button>
      <button className="selection-button selection-reject" onClick={() => reject(name)}>{t('Reject')}</button>
    </div>
  )
}


export default connector(SelectionView)

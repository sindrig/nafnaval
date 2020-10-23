import React from 'react'
import { Dispatch, Action as DispatchAction, bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { moveName } from '../store/names/actions'
import { List } from 'immutable'
import { IStoreState } from '../store/reducer'
import { Bucket } from '../store/names/types'
import ShowSelection, { Action } from './ShowSelection'

function mapStateToProps({ names: { selected, rejected } }: IStoreState) {
  return { selected, rejected }
}

function mapDispatchToProps(dispatch: Dispatch<DispatchAction>) {
  return {
    moveName: bindActionCreators(moveName, dispatch),
  }
}
const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  selected: List<string>
  rejected: List<string>
}

const SelectedComponent: React.FC<Props> = ({ selected, moveName }: Props) => {
  const { t } = useTranslation()
  const actions: Action[] = [
    {
      label: t('Reject'),
      action: (name) => moveName(name, Bucket.Selected, Bucket.Rejected),
    },
    {
      label: t('Remove from list'),
      action: (name) => moveName(name, Bucket.Selected, Bucket.Remaining),
    },
  ]
  return <ShowSelection names={selected} actions={actions} />
}

export const Selected = connector(SelectedComponent)

const RejectedComponent: React.FC<Props> = ({ rejected, moveName }: Props) => {
  const { t } = useTranslation()
  const actions: Action[] = [
    {
      label: t('Select'),
      action: (name) => moveName(name, Bucket.Rejected, Bucket.Selected),
    },
    {
      label: t('Remove from list'),
      action: (name) => moveName(name, Bucket.Rejected, Bucket.Remaining),
    },
  ]
  return <ShowSelection names={rejected} actions={actions} />
}

export const Rejected = connector(RejectedComponent)

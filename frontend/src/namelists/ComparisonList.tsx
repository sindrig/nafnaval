import React, { useEffect } from 'react';
import { Dispatch, Action as DispatchAction, bindActionCreators } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getComparisonList } from '../store/comparison/actions';
import { List } from 'immutable';
import { IStoreState } from '../store/reducer';
import { Progress } from '../store/comparison/types';
import ShowSelection, { Action } from './ShowSelection';


function mapStateToProps({comparison: { names, progress }}: IStoreState) {
  return { names, progress };
}

function mapDispatchToProps(dispatch: Dispatch<DispatchAction>) {
  return {
    getComparisonList: bindActionCreators(getComparisonList, dispatch),
  };
}
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  names: List<string>
  progress: Progress
  id?: string
}

const ComparisonList: React.FC<Props> = ({ names, progress, getComparisonList, id }: Props) => {
  const { t } = useTranslation();
  console.log('id', id);
  useEffect(() => {
    if (id) {
      getComparisonList(id)
    }
  }, [getComparisonList, id]);
  if ( !id ) {
    return null;
  }
  return (
    <ShowSelection names={names} />
   )
}

export default connector(ComparisonList);

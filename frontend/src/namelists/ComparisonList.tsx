import React, { useEffect } from 'react';
import { Dispatch, Action as DispatchAction, bindActionCreators } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getComparisonList } from '../store/comparison/actions';
import { List } from 'immutable';
import { IStoreState } from '../store/reducer';
import { Progress } from '../store/comparison/types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ShowSelection from './ShowSelection';


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

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  progress: {
    display: 'inline-block',
    float: 'left',
    width: '50%',
  }
});

const ComparisonList: React.FC<Props> = ({ names, progress, getComparisonList, id }: Props) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (id) {
      getComparisonList(id)
    }
  }, [getComparisonList, id]);
  const classes = useStyles();
  if ( !id ) {
    return null;
  }
  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2" className={classes.progress}>
            {t('Your progress')}: {Math.floor(progress.self * 100)}%
          </Typography>
          <Typography variant="h5" component="h2" align="right" className={classes.progress}>
            {t('Partner progress')}: {Math.floor(progress.counterpart * 100)}%
          </Typography>
        </CardContent>
      </Card>
      <ShowSelection names={names} />
    </div>
   )
}

export default connector(ComparisonList);

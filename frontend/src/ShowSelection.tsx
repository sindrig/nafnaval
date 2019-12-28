import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
// @ts-ignore
import { IStoreState } from './store/reducer';
import { List } from 'immutable';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
}));

function mapStateToProps({names: { selected, rejected }}: IStoreState) {
  return { selected, rejected };
}

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>
export enum SelectionType {
  selected,
  rejected
}
type Props = PropsFromRedux & {
  selected: List<string>
  rejected: List<string>
  selection: SelectionType
}


const ShowSelection: React.FC<Props> = ({selected, rejected, selection}: Props) => {
  const classes = useStyles();
  const nameList = selection === SelectionType.selected ? selected : rejected;
  console.log(nameList);
  return (
    <div className={classes.root}>
      <GridList cellHeight={30} className={classes.gridList} cols={3}>
        {nameList.map(name => (
          <GridListTile key={name} cols={1}>
            <span>{name}</span>
          </GridListTile>
        ))}
      </GridList>
    </div>
   )
}

export default connector(ShowSelection);

import React from 'react';
import { Dispatch, Action, bindActionCreators } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { moveName } from './store/names/actions';
// @ts-ignore
import { IStoreState } from './store/reducer';
import { Bucket } from './store/names/types';
import { List as ImmutableList, OrderedMap } from 'immutable';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ListItemText from '@material-ui/core/ListItemText';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    overflowX: 'hidden',
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function mapStateToProps({names: { selected, rejected }}: IStoreState) {
  return { selected, rejected };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    moveName: bindActionCreators(moveName, dispatch),
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>
export enum SelectionType {
  selected,
  rejected
}
type Props = PropsFromRedux & {
  selected: ImmutableList<string>
  rejected: ImmutableList<string>
  selection: SelectionType
  moveName: Function
}

const localeComparer = (a: string, b: string) => {
    return a.localeCompare(b)
};

const ShowSelection: React.FC<Props> = ({selected, rejected, selection, moveName}: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const nameList = selection === SelectionType.selected ? selected : rejected;
  const currentBucket = selection === SelectionType.selected ? Bucket.Selected : Bucket.Rejected;

  let nameMap = OrderedMap<string, ImmutableList<string>>();
  nameList.sort(localeComparer).forEach(name => {
    const key = name.substr(0, 1);
    const currentMap = nameMap.get(key);
    if ( currentMap ) {
      nameMap = nameMap.set(key, currentMap.push(name));
    } else {
      nameMap = nameMap.set(key, ImmutableList.of(name));
    }
  });
  return (
    <div className={classes.root}>

      <Grid container spacing={2}>
        {nameMap.keySeq().map((letter) => {
          return (
            <Grid item xs={4} md={2} key={letter}>
              <Typography variant="h6" className={classes.title}>
                {letter}
              </Typography>
              <div className={classes.demo}>
                <List dense>
                  {nameMap.get(letter)!.map(name => {
                    return (
                      <ListItem key={name}>
                        <ListItemText
                          primary={name}
                        />
                        <ListItemSecondaryAction>
                          <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                          >
                            { currentBucket !== Bucket.Selected
                              ? <MenuItem primaryText={t('Select')} onClick={() => moveName(name, currentBucket, Bucket.Selected)} />
                              : null
                            }
                            { currentBucket !== Bucket.Rejected
                              ? <MenuItem primaryText={t('Reject')} onClick={() => moveName(name, currentBucket, Bucket.Rejected)} />
                              : null
                            }
                            <MenuItem primaryText={t('Remove from list')} onClick={() => moveName(name, currentBucket, Bucket.Remaining)} />
                          </IconMenu>
                        </ListItemSecondaryAction>
                      </ListItem>
                     );
                  })}
                </List>
              </div>
            </Grid>
          )
        })}
      </Grid>
    </div>
   )
}

export default connector(ShowSelection);

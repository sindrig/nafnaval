import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import { IStoreState } from './store/reducer';
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
    overflow: 'hidden',
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

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>
export enum SelectionType {
  selected,
  rejected
}
type Props = PropsFromRedux & {
  selected: ImmutableList<string>
  rejected: ImmutableList<string>
  selection: SelectionType
}



const ShowSelection: React.FC<Props> = ({selected, rejected, selection}: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const nameList = selection === SelectionType.selected ? selected : rejected;
  const dense = true;
  const select = (name: string) => console.log(name);
  let nameMap = OrderedMap<string, ImmutableList<string>>();
  nameList.sort().forEach(name => {
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
            <Grid item xs={6} md={3} key={letter}>
              <Typography variant="h6" className={classes.title}>
                {letter}
              </Typography>
              <div className={classes.demo}>
                <List dense={dense}>
                  {nameMap.get(letter)!.map(name => {
                    return (
                      <ListItem>
                        <ListItemText
                          primary={name}
                        />
                        <ListItemSecondaryAction>
                          <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                          >
                            <MenuItem primaryText={t('Select')} onClick={() => select(name)} />
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

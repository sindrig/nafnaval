import React from 'react';
import { List as ImmutableList, OrderedMap } from 'immutable';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from 'material-ui/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconMenu from 'material-ui/IconMenu';

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


export interface Action {
  label: string
  action: (name: string) => void
}

interface Props {
  names: ImmutableList<string>
  actions?: Action[]
}

const localeComparer = (a: string, b: string) => {
    return a.localeCompare(b)
};

const ShowSelection: React.FC<Props> = ({ names, actions = [] }: Props) => {
  const classes = useStyles();

  let nameMap = OrderedMap<string, ImmutableList<string>>();
  names.sort(localeComparer).forEach(name => {
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
                        {actions.length > 0 ?
                          <ListItemSecondaryAction>
                            <IconMenu
                              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                            >
                              {actions.map(({label, action}) =>
                                <MenuItem primaryText={label} onClick={() => action(name)} key={label}/>
                              )}
                            </IconMenu>
                          </ListItemSecondaryAction> : null}
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

export default ShowSelection;

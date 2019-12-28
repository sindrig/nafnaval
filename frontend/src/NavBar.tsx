import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch, Action, bindActionCreators } from 'redux';
import { saveSelections } from './store/names/actions';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from "react-router-dom";
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { IStoreState } from './store/reducer';
import LeftDrawer from './LeftDrawer';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { UUID_REGEX } from './constants';
import { List } from 'immutable';
import { NameSelection } from './store/names/types';
import './NavBar.css'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function mapStateToProps({ names: { selections, stateId }}: IStoreState) {
  return { selections, stateId };
}


function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    save: bindActionCreators(saveSelections, dispatch),
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends RouteComponentProps<any> {
  selections: List<NameSelection>
  save: Function
  stateId?: string
}

const NavBar: React.FC<Props> = ({ location, selections, save, stateId }: Props) => {
  const match = location.pathname.match(`/(?<id>${UUID_REGEX})`)
  const { i18n, t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);
  const classes = useStyles();
  return (
    <div>
      <AppBar
        title="Nafnaval.is"
        onTitleClick={(openMenu)}
        iconElementLeft={<FontIcon onClick={(openMenu)} className="material-icons">menu</FontIcon>}
      >
        <LeftDrawer open={menuOpen} closeMenu={closeMenu} stateId={stateId || match?.groups?.id}/>
        <span className="navigation-toolbar">
          {selections.size && match?.groups?.id ?
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              startIcon={<SaveIcon />}
              onClick={() => save(match!.groups!.id, selections)}
            >
              {t('Save')}
            </Button> : null }
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            iconStyle={{ fill: 'rgba(0, 0, 0, 0.87)' }}
          >
            <MenuItem primaryText="Íslenska" onClick={() => i18n.changeLanguage('is')} />
            <MenuItem primaryText="English" onClick={() => i18n.changeLanguage('en')} />
          </IconMenu>
        </span>
      </AppBar>
    </div>
  )
}

export default withRouter(connector(NavBar));

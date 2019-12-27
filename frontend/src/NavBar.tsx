import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { IStoreState } from './store/reducer';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import './NavBar.css'


function mapStateToProps({ names: { stateId }}: IStoreState) {
  return { stateId };
}

const connector = connect(mapStateToProps);

interface Props {
  stateId?: string
  open: boolean
  closeMenu: () => void
}


const LeftDrawer: React.FC<Props> = ({ stateId, closeMenu, open }: Props) => {
  const { t } = useTranslation();
  const links = [];
  if (stateId) {
    links.push(
      <Link to={`/${stateId}`}>
        <MenuItem onClick={closeMenu}>
          {t('Select')}
        </MenuItem>
      </Link>
     )
    links.push(
      <Link to={`/${stateId}/selected`}>
        <MenuItem onClick={closeMenu}>
          {t('View selected')}
        </MenuItem>
      </Link>
     )
    links.push(
      <Link to={`/${stateId}/rejected`}>
        <MenuItem onClick={closeMenu}>
          {t('View rejected')}
        </MenuItem>
      </Link>
     )
  }
  links.push(
    <Link to={`/about`}>
      <MenuItem onClick={closeMenu}>
        {t('About')}
      </MenuItem>
    </Link>
  );
  return (
      <Drawer
        open={open}
        docked={false}
        width={200}
        onRequestChange={closeMenu}
      >
        {links}

      </Drawer>
   )
}

const NavBar: React.FC<RouteComponentProps<any>> = ({match: { params }}: RouteComponentProps) => {
  const [open, setOpen] = useState(false);
  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);
  return (
    <div>
      <AppBar
        title="Nafnaval.is"
        onTitleClick={(openMenu)}
        iconElementLeft={<FontIcon onClick={(openMenu)} className="material-icons">menu</FontIcon>}
      >
        <LeftDrawer open={open} closeMenu={closeMenu} />
        <span className="navigation-toolbar">
          <IconButton color="inherit" aria-label="More Options">
            <MoreVertIcon />
          </IconButton>
        </span>
      </AppBar>
    </div>
  )
}



export default withRouter(
  connector(NavBar)
) as React.ComponentClass<{}>;

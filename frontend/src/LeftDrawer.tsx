import React from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';


interface Props {
  open: boolean
  closeMenu: () => void
  stateId?: string
}


const LeftDrawer: React.FC<Props> = ({ closeMenu, open, stateId }: Props) => {
  const { t } = useTranslation();
  const links = [];
  if ( stateId ) {
    links.push(
      <Link to={`/${stateId}`} key="stateHome">
        <MenuItem onClick={closeMenu}>
          {t('Select')}
        </MenuItem>
      </Link>
     )
    links.push(
      <Link to={`/${stateId}/selected`} key="stateSelected">
        <MenuItem onClick={closeMenu}>
          {t('View selected')}
        </MenuItem>
      </Link>
     )
    links.push(
      <Link to={`/${stateId}/rejected`} key="stateRejected">
        <MenuItem onClick={closeMenu}>
          {t('View rejected')}
        </MenuItem>
      </Link>
     )
  }
  links.push(
    <Link to={`/about`} key="about">
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

export default LeftDrawer;

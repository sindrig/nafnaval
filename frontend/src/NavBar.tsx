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
import './NavBar.css'


function mapStateToProps({ names: { stateId }}: IStoreState) {
  return { stateId };
}

const connector = connect(mapStateToProps);

interface Props extends RouteComponentProps<any> {
  stateId?: string
}


const NavBar: React.FC<Props> = ({match: { params }, stateId}: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  if ( !stateId ) {
    return null;
  }
  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);
  return (
    <div>
      <AppBar
        title="Nafnaval.is"
        onTitleClick={(openMenu)}
        iconElementLeft={<FontIcon onClick={(openMenu)} className="material-icons">menu</FontIcon>}
      />
      <Drawer
        open={open}
        docked={false}
        width={200}
        onRequestChange={(open) => setOpen(open)}
      >
        <Link to={`/${stateId}`}>
          <MenuItem onClick={closeMenu}>
            {t('Select')}
          </MenuItem>
        </Link>
        <Link to={`/${stateId}/selected`}>
          <MenuItem onClick={closeMenu}>
            {t('View selected')}
          </MenuItem>
        </Link>
        <Link to={`/${stateId}/rejected`}>
          <MenuItem onClick={closeMenu}>
            {t('View rejected')}
          </MenuItem>
        </Link>
      </Drawer>
    </div>
  )
}



export default withRouter(
  connector(NavBar)
) as React.ComponentClass<{}>;

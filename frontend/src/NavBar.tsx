import React, { useState } from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LeftDrawer from './LeftDrawer';
import './NavBar.css'


const NavBar: React.FC = () => {
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

export default NavBar;

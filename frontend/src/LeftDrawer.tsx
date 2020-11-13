import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

interface Props {
  open: boolean
  closeMenu: () => void
  stateId?: string
}

const LeftDrawer: React.FC<Props> = ({ closeMenu, open, stateId }: Props) => {
  const { t } = useTranslation()
  const links = []
  if (stateId) {
    links.push(
      <Link to={`/${stateId}`} key="stateHome">
        <MenuItem onClick={closeMenu} data-testid="menu-select">
          {t('Select')}
        </MenuItem>
      </Link>,
    )
    links.push(
      <Link
        to={`/${stateId}/selected`}
        key="stateSelected"
        data-testid="menu-view-selected"
      >
        <MenuItem onClick={closeMenu}>{t('View selected')}</MenuItem>
      </Link>,
    )
    links.push(
      <Link
        to={`/${stateId}/rejected`}
        key="stateRejected"
        data-testid="menu-view-rejected"
      >
        <MenuItem onClick={closeMenu}>{t('View rejected')}</MenuItem>
      </Link>,
    )
    links.push(
      <Link
        to={`/${stateId}/compare`}
        key="compareSelected"
        data-testid="menu-view-common"
      >
        <MenuItem onClick={closeMenu}>{t('View common names')}</MenuItem>
      </Link>,
    )
  }
  links.push(
    <Link to={`/`} key="signup">
      <MenuItem onClick={closeMenu} data-testid="menu-sign-up">
        {t('Sign up')}
      </MenuItem>
    </Link>,
  )
  links.push(
    <Link to={`/about`} key="about" data-testid="menu-about">
      <MenuItem onClick={closeMenu}>{t('About')}</MenuItem>
    </Link>,
  )
  return (
    <Drawer open={open} docked={false} width={200} onRequestChange={closeMenu}>
      {links}
    </Drawer>
  )
}

export default LeftDrawer

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch, Action, bindActionCreators } from 'redux'
import { persistChanges, undoChanges } from './store/names/actions'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import FontIcon from 'material-ui/FontIcon'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import { IStoreState } from './store/reducer'
import LeftDrawer from './LeftDrawer'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import Divider from '@material-ui/core/Divider'
import { UUID_REGEX } from './constants'
import Chip from '@material-ui/core/Chip'
import { List } from 'immutable'
import { NameMovement } from './store/names/types'
import './NavBar.css'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}))

function mapStateToProps({
  names: { movements, stateId, progress },
}: IStoreState) {
  return { movements, stateId, progress }
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    save: bindActionCreators(persistChanges, dispatch),
    undo: bindActionCreators(undoChanges, dispatch),
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface Props extends RouteComponentProps<any> {
  movements: List<NameMovement>
  save: Function
  undo: Function
  stateId?: string
  progress: number
}

const NavBar: React.FC<Props> = ({
  location,
  movements,
  save,
  stateId,
  progress,
  undo,
}: Props) => {
  const match = location.pathname.match(`/(?<id>${UUID_REGEX})`)
  const state = match?.groups?.id || stateId
  const { i18n, t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const openMenu = () => setMenuOpen(true)
  const closeMenu = () => setMenuOpen(false)
  const classes = useStyles()
  const hasChanges = movements.size && state
  return (
    <div>
      <AppBar
        title="Nafnaval.is"
        onTitleClick={openMenu}
        iconElementLeft={
          <FontIcon onClick={openMenu} className="material-icons">
            menu
          </FontIcon>
        }
      >
        <LeftDrawer open={menuOpen} closeMenu={closeMenu} stateId={state} />
        <span className="navigation-toolbar">
          {state ? <Chip label={`${Math.floor(progress * 100)}%`} /> : null}
          {hasChanges ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              startIcon={<SaveIcon />}
              onClick={() => save(match!.groups!.id, movements)}
            >
              {t('Save')}
            </Button>
          ) : null}
          <IconMenu
            iconButtonElement={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            {hasChanges ? (
              <React.Fragment>
                <MenuItem
                  primaryText={t('Undo')}
                  onClick={() => undo(movements.getIn([-1, 'name']))}
                />
                <Divider />
              </React.Fragment>
            ) : null}
            <MenuItem
              primaryText="Íslenska"
              onClick={() => i18n.changeLanguage('is')}
            />
            <MenuItem
              primaryText="English"
              onClick={() => i18n.changeLanguage('en')}
            />
          </IconMenu>
        </span>
      </AppBar>
    </div>
  )
}

export default withRouter(connector(NavBar))

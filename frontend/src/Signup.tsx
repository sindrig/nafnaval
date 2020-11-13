import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect } from 'react-router'
import { Dispatch, Action, bindActionCreators } from 'redux'
import { signUp as signUpAction } from './store/names/actions'
import { IStoreState } from './store/reducer'
import useForm from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

import './App.css'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    signUp: bindActionCreators(signUpAction, dispatch),
  }
}

function mapStateToProps({ names: { stateId } }: IStoreState) {
  return { stateId }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  signUp: Function
  stateId?: string
}

interface SignupForm {
  email1: string
  email2: string
}

const Signup: React.FC<Props> = ({ signUp, stateId }: Props) => {
  const [gender, setGender] = useState('female')
  const { register, handleSubmit } = useForm<SignupForm>()
  const { t } = useTranslation()
  const classes = useStyles()
  const onSubmit = ({ email1, email2 }: SignupForm) => {
    signUp(email1, email2, gender)
  }
  if (stateId) {
    return <Redirect to={`/${stateId}`} />
  }
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {t('Sign up')}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="email"
                name="email1"
                variant="outlined"
                required
                fullWidth
                label={t('Your e-mail')}
                autoFocus
                type="email"
                inputRef={register}
                inputProps={{ 'data-testid': 'your-email-input' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email2"
                variant="outlined"
                required
                fullWidth
                label={t('Partner e-mail')}
                type="email"
                inputRef={register}
                inputProps={{ 'data-testid': 'partner-email-input' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RadioGroup
                aria-label="gender"
                name="gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio color="primary" data-testid="female-radio" />}
                  label={t('Female')}
                  innerRef={register}
                />
                <FormControlLabel
                  value="male"
                  control={<Radio color="primary" data-testid="male-radio" />}
                  label={t('Male')}
                  innerRef={register}
                />
                <FormControlLabel
                  value="both"
                  control={<Radio color="primary" data-testid="both-radio" />}
                  label={t('Both')}
                  innerRef={register}
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {t('Submit')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

export default connector(Signup)

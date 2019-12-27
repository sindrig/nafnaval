import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from 'react-router';
import { Dispatch, Action, bindActionCreators } from 'redux';
import { signUp as signUpAction } from './store/names/actions';
import { IStoreState } from './store/reducer';
import useForm from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import './App.css';

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    signUp: bindActionCreators(signUpAction, dispatch)
  };
}

function mapStateToProps({ names: { stateId }}: IStoreState) {
  return { stateId };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  signUp: Function
  stateId?: string
}

interface SignupForm {
    email1: string
    email2: string
    sex: string
}

const Signup: React.FC<Props> = ({ signUp, stateId }: Props) => {
    const { register, handleSubmit } = useForm<SignupForm>();
    const { t } = useTranslation();
    const onSubmit = ({email1, email2, sex}: SignupForm) => {
        signUp(email1, email2, sex);
    }
    if (stateId) {
        return <Redirect to={`/${stateId}`} />
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    {t('Your e-mail')}
                    <input name="email1" ref={register} type="email" />
                </label>
                <label>
                    {t('Partner e-mail')}
                    <input name="email2" ref={register} type="email" />
                </label>
                <label>
                    {t('Male')}
                    <input type="radio" name="sex" value="male" ref={register}/>
                </label>
                <label>
                    {t('Female')}
                    <input type="radio" name="sex" value="female" ref={register}/>
                </label>

                <button type="submit">{t('Submit')}</button>
            </form>
        </div>
    );
}



export default connector(Signup)

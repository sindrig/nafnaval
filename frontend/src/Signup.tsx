import React from 'react';
import useForm from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import './App.css';

const Signup: React.FC = () => {
    const { register, handleSubmit } = useForm();
    const { t } = useTranslation();
    const onSubmit = console.log;
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

export default Signup;

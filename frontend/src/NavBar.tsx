import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { IStoreState } from './store/reducer';
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
  if ( !stateId ) {
    return null;
  }
  return (
    <div className="navigation-bar">
      <Link to={`/${stateId}`}>{t('Select')}</Link>
      <Link to={`/${stateId}/selected`}>{t('View selected')}</Link>
      <Link to={`/${stateId}/rejected`}>{t('View rejected')}</Link>
    </div>
  )
}



export default withRouter(
  connector(NavBar)
) as React.ComponentClass<{}>;

import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch, Action, bindActionCreators } from 'redux';
import { IStoreState } from './store/reducer';
import { getNames as getNamesAction } from './store/names/actions';
import { Name } from './store/names/types';


interface SelectionProps extends RouteComponentProps<any> {
  readonly names: Name[]
  readonly error: boolean
  readonly initializing: boolean
  getNames: (id: string) => (dispatch: Dispatch<Action>) => Promise<void>
}

class Selection extends React.Component<SelectionProps> {
  constructor(props: SelectionProps) {
    super(props);
    this.getNames = this.getNames.bind(this);
  }

  private async getNames(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    await this.props.getNames(this.props.match.params.id);
  }

  render() {
    return (
      <a onClick={this.getNames}>Get names</a>
    )
  }
}

function mapStateToProps(state: IStoreState) {
  return state.names;
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    getNames: bindActionCreators(getNamesAction, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Selection)
) as React.ComponentClass<{}>;

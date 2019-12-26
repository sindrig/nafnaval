import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch, Action, bindActionCreators } from 'redux';
import { IStoreState } from './store/reducer';
import { getNames as getNamesAction } from './store/names/actions';


interface SelectionProps extends RouteComponentProps<any> {
  readonly remaining: string[]
  getNames: (id: string) => (dispatch: Dispatch<Action>) => Promise<void>
}

class Selection extends React.Component<SelectionProps> {
  constructor(props: SelectionProps) {
    super(props);
  }

  componentDidMount() {
    const { getNames, match: { params }} = this.props;
    getNames(params.id);
  }

  render() {
    const { remaining } = this.props;
    if ( remaining.length === 0 ) {
      return <div>All done... TODO</div>
    }
    const name = remaining[Math.floor(Math.random() * remaining.length)];
    return (
      <div>{name}</div>
    )
  }
}

function mapStateToProps({ names: { remaining }}: IStoreState) {
  return { remaining };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    getNames: bindActionCreators(getNamesAction, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Selection)
) as React.ComponentClass<{}>;

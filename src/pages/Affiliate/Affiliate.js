import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { resetPassword } from "../../actions/signInActions";
import AffiliateForm from "../../components/Authentication/Affiliate/AffiliateForm";

class Affiliate extends Component {
  onSubmit = formValues => {
    this.props.actions.resetPassword(formValues, this.props.history);
  };
  render() {
    const { errors } = this.props.store;
    return <AffiliateForm errors={errors} onSubmit={this.onSubmit} />;
  }
}

function mapStateToProps(state) {
  return {
    store: state.UserStore
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ resetPassword }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Affiliate);

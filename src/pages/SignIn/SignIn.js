import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchToken } from "../../actions/signInActions";
import SignInForm from "../../components/Authentication/SignIn/SignInForm";

import "./SignIn.scss";

class SignIn extends Component {
  onSubmit = formValues => {
    this.props.signupUser(formValues, this.props.history);
  };
  render() {
    const { errors } = this.props.store;
    return <SignInForm errors={errors} onSubmit={this.onSubmit} />;
  }
}

function mapStateToProps(state) {
  return {
    store: state.UserStore
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        fetchToken
      },
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);

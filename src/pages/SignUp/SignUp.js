import React from "react";
import { connect } from "react-redux";

import SignUpForm from "../../components/Authentication/SignUp/SignUpForm";

class SignUp extends React.Component {
  onSubmit = formValues => {};

  render() {
    return (
      <>
        <SignUpForm onSubmit={this.onSubmit} />
      </>
    );
  }
}

export default connect(
  null,
  null
)(SignUp);

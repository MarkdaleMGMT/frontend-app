import React from "react";
import { connect } from "react-redux";
import { signupUser } from "../../actions/signUpActions";
import SignUpForm from "../../components/Authentication/SignUp/SignUpForm";

class SignUp extends React.Component {
  onSubmit = formValues => {
    this.props.signupUser(formValues, this.props.history);
  };

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
  { signupUser }
)(SignUp);

import React from "react";
import { connect } from "react-redux";
import { signupUser } from "../../actions/signUpActions";
import SignUpForm from "../../components/Authentication/SignUp/SignUpForm";

class SignUp extends React.Component {
  onSubmit = formValues => {
    this.props.signupUser(formValues, this.props.history);
  };

  render() {
    const { errors } = this.props.isError;
    return (
      <>
        <SignUpForm errors={errors} onSubmit={this.onSubmit} />
      </>
    );
  }
}

//to map errors from the user store to the signup page
const mapStateToProps = state => {
  return {
    isError: state.UserStore
  };
};

export default connect(
  mapStateToProps,
  { signupUser }
)(SignUp);

import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { NavLink } from "react-router-dom";

import "./SignUp.scss";

const validate = values => {
  const errors = {};
  if (!values.userName) {
    errors.userName = "Required";
  } else if (values.userName.length < 4) {
    errors.userName = "Minimum be 4 characters or more";
  }
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 4) {
    errors.password = "Minimum be 4 characters or more";
  }
  if (!values.referralCode) {
    errors.referralCode = "Required";
  }
  return errors;
};

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <div>
    <input
      {...input}
      placeholder={label}
      type={type}
      className="form-control"
    />
    {touched &&
      ((error && <span className="text-danger">{error}</span>) ||
        (warning && <span>{warning}</span>))}
  </div>
);

class SignUp extends Component {
  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <div className="signin-container">
        <div>
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="form-group">
              <Field name="userName" component={renderField} label="Username" />
            </div>
            <div className="form-group">
              <Field name="password" component={renderField} label="Password" />
            </div>
            <div className="form-group">
              <Field name="email" component={renderField} label="Email" />
            </div>
            <div className="form-group">
              <Field
                name="referralCode"
                component={renderField}
                label="Referral Code"
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                disabled={pristine || submitting}
                className="btn btn-info signup-btn"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        <div className="signup-options-container">
          <NavLink to="/signIn" className="signup-link">
            Sign In
          </NavLink>
          <NavLink to="/forgotpassword" className="forgot-password-link">
            Forgot
          </NavLink>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: "signup",
  validate
})(SignUp);
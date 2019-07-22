import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";

import { NavLink } from "react-router-dom";

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = "Username Required";
  } else if (values.username.length < 4) {
    errors.username = "Username must have atleast 4 characters";
  }

  if (!values.password) {
    errors.password = "Password Required";
  } else if (values.password.length < 4) {
    errors.password = "Password must have atleast 4 characters";
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

class SignIn extends Component {
  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    const { errors, handleSubmit, pristine, submitting } = this.props;
    return (
      <div className="signin-container">
        <div>
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="form-group">
              <Field name="username" component={renderField} label="Username" />
            </div>
            <div className="form-group">
              <Field
                type="password"
                name="password"
                component={renderField}
                label="Password"
              />
            </div>

            {/* rendering server side validation */}
            <p className="text-danger">{errors && errors.error}</p>
            <div className="form-group">
              <button
                type="submit"
                disabled={pristine || submitting}
                className="btn btn-info signin-btn"
              >
                SignIn
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
  form: "signin",
  validate
})(SignIn);

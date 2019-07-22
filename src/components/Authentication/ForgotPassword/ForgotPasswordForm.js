import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";

import { NavLink } from "react-router-dom";

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = "Email Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
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

class ForgotPassword extends Component {
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
              <Field name="email" component={renderField} label="Email" />
            </div>

            {/* rendering server side validation */}
            <p className="text-danger">{errors && errors.error}</p>
            <div className="form-group">
              <button
                type="submit"
                disabled={pristine || submitting}
                className="btn btn-info signin-btn"
              >
                Forgot Password
              </button>
            </div>
          </form>
        </div>

        <div className="signup-options-container">
          <NavLink to="/signIn" className="signup-link">
            Sign In
          </NavLink>
          <NavLink to="/signUp" className="forgot-password-link">
            sign Up
          </NavLink>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: "ForgotPassword",
  validate
})(ForgotPassword);

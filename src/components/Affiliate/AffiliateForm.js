import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = "Email required";
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

class AffiliateForm extends Component {
  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    const { store, handleSubmit, pristine, submitting } = this.props;
    return (
      <div className="signin-container">
        <div>
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="form-group">
              <Field name="email" component={renderField} label="Email" />
            </div>

            {/* rendering server side validation */}
            <p className="text-danger">{store && store.ref_code}</p>
            <div className="form-group">
              <button
                type="submit"
                disabled={pristine || submitting}
                className="btn btn-info signin-btn"
              >
                Invite
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: "AffiliateForm",
  validate
})(AffiliateForm);

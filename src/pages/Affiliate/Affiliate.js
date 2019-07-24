import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { send_invite } from "../../actions/affiliateActions";
import AffiliateForm from "../../components/Affiliate/AffiliateForm";
import "./Affiliate.scss";

class Affiliate extends Component {
  onSubmit = formValues => {
    this.props.actions.send_invite(formValues, this.props.history);
  };
  render() {
    const { store } = this.props;
    return (
      <>
        <AffiliateForm
          errors={store.errors}
          referralCode={store}
          onSubmit={this.onSubmit}
        />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    store: state.UserStore
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ send_invite }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Affiliate);

import React, { Component } from "react";

import "./ReferralCard.scss";

class ReferralCard extends Component {
  render() {
    const { referralCode } = this.props;
    return (
      <div className="rounded-lg card-width mx-auto mb-5 border shadow bg-white">
        <div className="card ">
          <div className="card-body">
            <h5 className="card-title">Referral Code</h5>

            <h2 className="card-text text-info">
              {referralCode && referralCode.ref_code}
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

export default ReferralCard;

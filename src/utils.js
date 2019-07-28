import axios from 'axios';
function urlFunction(urlending) {
  let url = 'http://178.128.233.31/frontend' + urlending;
  return url;
}
export default {
  //login
  login: data => {
    return axios.post(urlFunction('login'), data);
  },
  //signup
  signup: data => {
    return axios.post(urlFunction('signup'), data);
  },
  //get all investments
  all_investments: () => {
    return axios.get(urlFunction('all_investments'));
  },
  //get user's referal code
  user_referal_code: data => {
    return axios.get(
      urlFunction('user_data', {
        params: { username: data.username }
      })
    );
  },
  //reset password
  reset_password: data => {
    return axios.post(urlFunction('reset_password'), data);
  },
  //update password
  update_password: data => {
    return axios.post(urlFunction('update_password', data));
  },
  //confirm email
  confirm_email: () => {
    return axios.get(urlFunction('email'));
  },
  //test api
  test_api: data => {
    return axios.post(urlFunction('test'), data);
  }
};

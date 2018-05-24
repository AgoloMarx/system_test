const axios = require('axios');

const deleteFeed = (params) => {
  const { feedId } = params;
  const url = `${API_URL}/feeds/v2.0/feeds/${feedId}`;
  const user = JSON.parse(window.localStorage.getItem('user'));
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': localStorage.getItem('FEEDS_LOGIN_SUBSCRIPTION_KEY'),
      Authorization: `Bearer ${user.jwt}`,
    },
  };
  return axios.delete(url, config).then((res) => {
    if (res.status === 204) {
      return {
        status: 204,
        message: `Successfully Deleted Feed ${feedId}`,
      };
    } else if (res.status === 401) {
      return res;
    } else {
      return {
        status: -1,
        message: 'An Error Occured',
      };
    }
  }).catch((err) => {
    console.log(`Error Occured ${err}`);
    return {
      status: -1,
      message: 'An Error Occured',
    };
  });
};

module.exports = {
  deleteFeed,
}
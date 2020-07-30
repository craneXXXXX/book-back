import axios from "axios";
import qs from "qs";
export default {
  login(username, userpwd, usertype) {
    return axios({
      url: "/localback/book-react-php/login.php",
      method: "post",
      data: qs.stringify({
        username,
        userpwd,
        usertype,
      }),
    });
  },
  register(username, userpwd, usertype) {
    return axios({
      url: "/localback/book-react-php/register.php",
      method: "post",
      data: qs.stringify({
        username,
        userpwd,
        usertype,
      }),
    });
  },
};

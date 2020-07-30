import axios from "axios";
export default {
  searchorderlist() {
    return axios(`/localback/book-react-php/backSearchorderlist.php`);
  },
  updateordertype(id, type, deliverytimes) {
    return axios(
      `/localback/book-react-php/backUpdateordertypedelivery.php?id=${id}&type=${type}&deliverytimes=${deliverytimes}`
    );
  },
};

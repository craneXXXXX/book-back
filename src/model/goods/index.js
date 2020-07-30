import axios from "axios";
export default {
  searchgoodslist() {
    return axios(`/localback/book-react-php/backSearchgoodslist.php`);
  },
  addgoodslist(goodsname,goodsprice,goodsimg,goodsnum,goodsdiscount,comment,times) {
    return axios(
      `/localback/book-react-php/backAddgoodslist.php?goodsname=${goodsname}&goodsprice=${goodsprice}&goodsimg=${goodsimg}&goodsnum=${goodsnum}&
      goodsdiscount=${goodsdiscount}&comment=${comment}&times=${times}`
    );
  },
  deleteOnegoodslist(id) {
    return axios(
      `/localback/book-react-php/backDeleteonegoodslist.php?id=${id}`
    );
  },
};

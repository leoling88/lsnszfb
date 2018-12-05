/**
 * Created by Administrator on 2017-12-15.
 */

// 想不到更好的办法，在打包成webapp后，ajax请求如果不写全路径，在本地上访问不到
// const doMain = 'http://119.23.204.188:8088';
// const doMain = 'http://192.168.10.43:8082';
// const baseURL = process.env.NODE_ENV === 'production' ? `${doMain}/cnLaiSui` : '/cnLaiSui';
// const baseURL = '/cnLaiSui';
const baseURL = '/cnLaiSui';

export default baseURL;

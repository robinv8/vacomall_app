/**
 * Created by renyubin on 16/6/18.
 */
'use strict';

/*---View---*/
import Login from '../Login';
import MainScreen from '../MainScreen';
import MainPage from '../MainPage';

/*---首页相关模块---*/
import HomePage from '../HomePage';
import HomeHeader from '../HomePage/HomeHeader';
import MenuButton from '../HomePage/MenuButton';

/*---列表相关模块---*/
import ListPage from '../ListPage';

/*---详情相关模块---*/
import GoodsDetail from '../GoodsDetail';

/*---搜索相关模块---*/

/*---商品类目相关模块---*/

/*---购物车相关模块---*/

/*---订单支付相关模块---*/



//import ViewPull from '../ViewPull'




/*---第三方组件---*/
import codePush from "react-native-code-push";
import Swiper from 'react-native-swiper2';

/*---自定义工具类---*/
import API from './api';
import * as NetService from './NetService';


let Path ={
    Login: Login,//登录页面
    MainScreen: MainScreen,//APP主入口
    HomeHeader:HomeHeader,//首页头部
    MenuButton:MenuButton,//快捷入口
    ListPage:ListPage,//商品列表
    GoodsDetail:GoodsDetail,//商品详情
    codePush: codePush,//热更新
    Swiper:Swiper,//图片轮播
    API:API,//接口api
    NetService:NetService,//自定义网络请求
    HomePage:HomePage//首页
}
export default Path;
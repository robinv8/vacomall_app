/**
 * Created by renyubin on 16/6/18.
 */
'use strict';

/*---View---*/
import Login from '../Login';
import RetrievePwd from '../RetrievePwd';
import RetrievePwdHeader from '../RetrievePwd/RetrievePwdHeader';
import MainScreen from '../MainScreen';
import MainPage from '../../MainPage';

/*---首页相关模块---*/
import HomePage from '../HomePage';
import HomeHeader from '../HomePage/HomeHeader';
import MenuButton from '../HomePage/MenuButton';

/*---列表相关模块---*/
import ListPage from '../ListPage';
import ListHeader from '../ListPage/ListHeader';

/*---详情相关模块---*/
import GoodsDetail from '../GoodsDetail';
import DetailHeader from '../GoodsDetail/DetailHeader'
import Detail from '../GoodsDetail/Detail';
import DetailImg from '../GoodsDetail/DetailImg';
import DetailSwiper from '../GoodsDetail/DetailSwiper';
import GoodsSpec from '../GoodsDetail/GoodsSpec';


/*---搜索相关模块---*/
import SearchPage from '../SearchPage';

/*---商品类目相关模块---*/
import CategoryList from '../CategoryList';
import CategoryHeader from '../Category/CategoryHeader';
import FirstCate from '../Category/FirstCate';
import SubCate from '../Category/SubCate';

/*---购物车相关模块---*/
import CartPage from '../CartPage';
import CartHeader from '../Cart/CartHeader';
import EditCartHeader from '../EditCart/EditCartHeader';
/*---订单支付相关模块---*/
import OrderPage from '../OrderPage';
import OrderHeader from '../Order/OrderHeader';

import OrderSelectPage from '../OrderSelectPage';
import OrderAll from '../OrderDetail/OrderAll';
import OrderDFK from '../OrderDetail/OrderDFK';
import OrderDFH from '../OrderDetail/OrderDFH';
import OrderDSH from '../OrderDetail/OrderDSH';
import OrderList from '../OrderDetail/OrderList';
import OrderDetail from '../OrderDetail';
import OrderDetailHeader from '../Order/OrderDetailHeader';
import OrderExpressHeader from '../Order/OrderExpressHeader';
import OrderExpress from '../OrderExpress';
import ReturnSKU from '../OrderDetail/ReturnSKU';
import ReturnSKUEdit from '../ReturnSKUEdit';
import ReturnSKUEditHeader from '../ReturnSKUEdit/ReturnSKUEditHeader';
import ReturnListComponent from '../OrderDetail/ReturnListComponent';
/*---充值---*/
import ChongZhiPage from '../ChongZhiPage';
import * as ChongZhi from '../ChongZhiPage';
import Flow from '../chongzhi/Flow';
import HuaFei from '../chongzhi/HuaFei';

/*---支付---*/
import PaySuccess from '../Pay/PaySuccess';
import PayHDFK from '../Pay/PayHDFK';
import PayError from '../Pay/PayError';
/*---个人中心---*/
import Person from '../Person';
import PersonSafe from '../Person/PersonSafe';
import PersonInfo from '../Person/PersonInfo';

import IntroPage from '../IntroPage';
import Loaddingpage from '../Loaddingpage';
import Guess from '../Guess';
import AbortVacomall from '../AbortVacomall';

/*---第三方组件---*/
import TabNavigator from 'react-native-tab-navigator';
import codePush from 'react-native-code-push';
import Swiper from 'react-native-swiper2';
import Toast from 'react-native-root-toast';
import WebViewBridge from 'react-native-webview-bridge';
import LinearGradient from 'react-native-linear-gradient';
import Reactotron from 'reactotron';
import ListViewRowEdit from 'react-native-listview-row-edit';
import ScrollableTabView,{DefaultTabBar}  from 'react-native-scrollable-tab-view';
import WeChatIos from 'react-native-wechat-ios';
import WeChatAndroid from 'react-native-wechat-android';
import AppIntro from 'react-native-app-intro';
import Picker from 'react-native-picker';
import HTML from 'react-native-fence-html';
/*---自定义工具类---*/
import API from './api';
import * as NetService from './NetService';
import * as Random from './random';
import md5 from './md5.min';
import * as WeChatPayIos from './WeChatPayIos';
import * as WeChatPayAndroid from './WeChatPayAndroid';

import BarCodeAndroid from './BarCodeAndroid'
import BarCodeIos from './BarCodeIos'

export {
    MainPage,
    MainScreen,//APP主入口
    codePush,//热更新
    HomePage,//首页
    HomeHeader,//首页头部
    Swiper,//图片轮播
    MenuButton,//快捷入口,
    ListPage,//商品列表
    GoodsDetail,//商品详情,
    API,//接口API
    NetService,//自定义网络请求,
    CategoryList,//商品类目
    CategoryHeader,//商品类目头部
    FirstCate,//一级类目,
    SubCate,//二级类目,
    SearchPage,//搜索页面,
    CartPage,//购物车页面,
    Login,//登录
    Toast,//提示工具
    ListHeader,//列表头,
    DetailHeader,//商品详情头部
    Detail,//详情内容
    DetailSwiper,//商品详情轮播图
    DetailImg,//商品详情图片
    GoodsSpec,//商品规格
    md5,
    WebViewBridge,//htmlview
    LinearGradient,//渐变色
    RetrievePwd,//找回密码
    RetrievePwdHeader,//找回密码
    WeChatPayIos,
    WeChatPayAndroid,
    ChongZhi,
    ChongZhiPage,
    Reactotron,
    TabNavigator,
    Person,
    CartHeader,
    OrderPage,
    EditCartHeader,
    ListViewRowEdit,
    ScrollableTabView,
    DefaultTabBar,
    Flow,
    HuaFei,
    OrderSelectPage,
    OrderAll,
    PaySuccess,
    PayError,
    OrderHeader,
    PayHDFK,
    WeChatAndroid,
    WeChatIos,
    Random,
    OrderDFK,
    OrderDFH,
    OrderDSH,
    AppIntro,
    IntroPage,
    OrderList,
    OrderDetail,
    OrderDetailHeader,
    OrderExpressHeader,
    OrderExpress,
    Loaddingpage,
    ReturnSKU,
    ReturnSKUEdit,
    ReturnSKUEditHeader,
    Picker,
    ReturnListComponent,
    Guess,
    BarCodeAndroid,
    BarCodeIos,
    PersonSafe,
    PersonInfo,
    AbortVacomall,
    HTML
};

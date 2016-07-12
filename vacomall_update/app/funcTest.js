/**
 * Created by renyubin on 16/5/13.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Alert,
    WebView,
Text
} from 'react-native';

export default class FuncTest extends Component{
    onNavigationStateChange(navState) {
        console.log(navState)
    }

    render(){
        var html = `
      <html>
      <script type="text/javascript" src="http://cdn.vacomall.com/web/v2/js/jquery-1.10.1.min.js"></script>

        <body>
          <link rel="stylesheet" type="text/css" href="http://cdn.vacomall.com/webact/20160512/dianxinri/css/dianxinri.css" />
<div class="g-wrap">

	<div class="bg">
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
				<div class="goods">
					<a href="#">
					<div class="img-con">
						<img src="http://cdn.vacomall.com/webact/20160512/dianxinri/images/t2.jpg" alt="" />
					</div>
					<div class="img-text">
						电信日电器大卖
					</div>
					<div class="text">
						<div class="price">
							<span>专享价:</span><span>￥</span><span>999</span><span>原价:999.0</span>
						</div>
						<div class="btn">
							立即抢购<i></i>
						</div>
					</div>
</a>
				</div>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript" src="http://cdn.vacomall.com/webact/20160512/dianxinri/js/dianxinri.js"></script>
  <script>
          var pinID = 0;
          $('.g-wrap a').attr('href','http://www.baidu.com');
          $('a').click(function(){
            document.title = $(this).attr('href');
            window.location.hash = pinID++;
            return false;
          })
        </script>
        </body>
      </html>
    `;
        return (
            <View>
                <Text>Native View</Text>
                <Text>w</Text>
                <Text>Web View</Text>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    style={{height: 1000}}
                    source={{html:html}}
                    onNavigationStateChange={this.onNavigationStateChange}

                    startInLoadingState={true}
                />
            </View>
        );
    }
}
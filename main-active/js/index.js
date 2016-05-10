var activeFlag=0;
var startDate=0;
var endDate=0;
function timer(){
	var endTime=$(".count-down").attr("data-end-time").split('.');
	var year=parseInt(endTime[0]);
	var month=parseInt(endTime[1])-1;
	var day=parseInt(endTime[2]);
	var hour=parseInt(endTime[3]);
	var minute=parseInt(endTime[4]);
	var second=parseInt(endTime[5]);
	var ts = (new Date(year, month,day, hour, minute, second)) - (new Date());//计算剩余的毫秒数
	startDate=new Date(year, month,day, hour, minute, second).getDate();
	var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
	var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
	var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
	var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
	
	dd = (checkTime(dd)).toString();
	hh = checkTime(hh).toString();
	mm = checkTime(mm).toString();
	ss = checkTime(ss).toString();
	if(dd.indexOf('-')<0&&hh.indexOf('-')<0&&mm.indexOf('-')<0&&ss.indexOf('-')<0){
		if(dd==="00"&&hh==="00"&&mm==="00"&&ss==="00"){
			activeFlag=1;
			clearInterval(setInter1);
			
			if(activeFlag===1){
				setInterval("timeLine()",1000)
			}
		}
	}else{
		clearInterval(setInter1);
		activeFlag=1;
		$(".count-down").each(function(){
			$(this).find(".d .n1").text(0);
			$(this).find(".d .n2").text(0);
			
			$(this).find(".h .n1").text(0);
			$(this).find(".h .n2").text(0);
			
			$(this).find(".m .n1").text(0);
			$(this).find(".m .n2").text(0);
			
			$(this).find(".s .n1").text(0);
			$(this).find(".s .n2").text(0);
		});
		
		if(activeFlag===1){
			setInterval("timeLine()",1000)
		}
		return;
	}
	
	$(".count-down").each(function(){
		$(this).find(".d .n1").text(dd.substring(0,1));
		$(this).find(".d .n2").text(dd.substring(1));
		
		$(this).find(".h .n1").text(hh.substring(0,1));
		$(this).find(".h .n2").text(hh.substring(1));
		
		$(this).find(".m .n1").text(mm.substring(0,1));
		$(this).find(".m .n2").text(mm.substring(1));
		
		$(this).find(".s .n1").text(ss.substring(0,1));
		$(this).find(".s .n2").text(ss.substring(1));
	});
}
function checkTime(i)  {  
   if (i < 10) {  
       i = "0" + i;  
    }  
   return i;  
}  

var _onresize=function(){
	var _w=document.body.clientWidth;
	var w=(1920-_w)/2;
	$(".side-menu").css('margin-left',-w+125);
	if(w>0){
		w="-"+w+"px";
	}else if(w<0){
		w=w.toString().substring(1)+"px";
	}
	$(".m-banner img").css('margin-left',w);
	
	/*light定位*/
	$(".m-banner").children(".light").each(function(){
		var left=$(this).attr("init-left");
		var _left=parseInt(left)+(_w-1910)/2;
		_left=_left+"px";
		$(this).css('left',_left);
	});
}
/*light 闪烁*/
;(function(){
	var i=0;
	$(".m-banner").children(".light:eq(0),.light:eq(2),.light:eq(4),.light:eq(6),.light:eq(8)").css({
				"box-shadow": "none",
				"-webkit-box-shadow":"none",
				"-moz-box-shadow":"none"
				})
	setInterval(function(){
		if(i%2===0){
			$(".m-banner").children(".light:eq(0),.light:eq(2),.light:eq(4),.light:eq(6),.light:eq(8)").css({
				"box-shadow": "none",
				"-webkit-box-shadow":"none",
				"-moz-box-shadow":"none"
				})
			$(".m-banner").children(".light:eq(1),.light:eq(3),.light:eq(5),.light:eq(7)").css({
				"box-shadow":"0px 0px 60px 9px #F7C69C",
				"-webkit-box-shadow":"0px 0px 60px 9px #F7C69C",
				"-moz-box-shadow":"0px 0px 60px 9px #F7C69C"
				})
		}else{
			$(".m-banner").children(".light:eq(1),.light:eq(3),.light:eq(5),.light:eq(7)").css({
				"box-shadow": "none",
				"-webkit-box-shadow":"none",
				"-moz-box-shadow":"none"
				})
			$(".m-banner").children(".light:eq(0),.light:eq(2),.light:eq(4),.light:eq(6),.light:eq(8)").css({
				"box-shadow":"0px 0px 60px 9px #F7C69C",
				"-webkit-box-shadow":"0px 0px 60px 9px #F7C69C",
				"-moz-box-shadow":"0px 0px 60px 9px #F7C69C"
				})
		}
		i++;
	},500)
})()
/*开始专场切换*/
function startSpecialPerformance(){
	var spArray=$(".m-countdown").attr("data-start-sp").split(',');
	if(spArray.length>0){
		for (var i=0;i<spArray.length;i++) {
			var index=parseInt(spArray[i]);
			$("body .goods-wrap:eq("+index+")").each(function(){
				var _this=$(this).find(".goods .c-href");
				_this.each(function(){
					$(this).children(":eq(0)").css("display","none");
					$(this).children(":eq(1)").css("display","block");
					$(this).children(":eq(2)").css("display","none");
				})
			})
		}
	}
}
function endSpecialPerformance(){
	var spArray=$(".m-countdown").attr("data-end-sp").split(',');
	if(spArray.length>0){
		for (var i=0;i<spArray.length;i++) {
			var index=parseInt(spArray[i]);
			$("body .goods-wrap:eq("+index+")").each(function(){
				var _this=$(this).find(".goods .c-href");
				_this.each(function(){
					$(this).children(":eq(0)").css("display","none");
					$(this).children(":eq(1)").css("display","none");
					$(this).children(":eq(2)").css("display","block");
				})
			})
		}
	}
}
function timeLineExc(_this){
	_this.addClass("on").siblings().removeClass("on");
	_this.prevAll().each(function(){
		$(this).find(".title span").text("(已结束)");
		
		$(this).find(".c-href").children(":eq(0)").css("display","none");
		$(this).find(".c-href").children(":eq(1)").css("display","none");
		$(this).find(".c-href").children(":eq(2)").css("display","block");
		
		var href=$(this).children("a").attr("href");
		$(this).children("a").attr("href","javascript:;");
		$(this).children("a").attr("data-href",href);
	})
	_this.find(".title span").text("(已开始)");
	_this.nextAll().each(function(){
		$(this).find(".title span").text("(预告)");
		
		$(this).find(".c-href").children(":eq(0)").css("display","block");
		$(this).find(".c-href").children(":eq(1)").css("display","none");
		$(this).find(".c-href").children(":eq(2)").css("display","none");
		
		var href=$(this).children("a").attr("href");
		$(this).children("a").attr("href","javascript:;");
		$(this).children("a").attr("data-href",href);
	});
	
	_this.find(".c-href").children(":eq(0)").css("display","none");
	_this.find(".c-href").children(":eq(1)").css("display","block");
	_this.find(".c-href").children(":eq(2)").css("display","none");
	var href=_this.children("a").attr("data-href");
	_this.children("a").attr("href",href);
}
function timeLine(){
	/*if(endDate<=startDate){
		return;
	}*/
	if(new Date().getHours()>20){
		$(".m-rush .r-con").find(".title span").text("(已结束)");
		return;
	}
	switch(new Date().getHours()){
		case 14:
			var _this=$(".m-rush .r-con:eq(0)");
			timeLineExc(_this)
		break;
		case 15:
			var _this=$(".m-rush .r-con:eq(1)");
			timeLineExc(_this)
		break;
		case 16:
			var _this=$(".m-rush .r-con:eq(2)");
			timeLineExc(_this)
		break;
		case 17:
			var _this=$(".m-rush .r-con:eq(3)");
			timeLineExc(_this)
		break;
		case 20:
			var _this=$(".m-rush .r-con:eq(4)");
			timeLineExc(_this)
		break;
	}
}
var setInter1="";
;(function($){
	
	$("body").find(".c-href").each(function(){
		$(this).children(":eq(0)").css("display","block");
		$(this).children(":eq(1)").css("display","none");
		$(this).children(":eq(2)").css("display","none");
	})
	
	var _this=$(".m-rush .r-con");
	var href=_this.children("a").attr("href");
	_this.children("a").attr("href","javascript:;");
	_this.children("a").attr("data-href",href);
	
	timer();
	setInter1=setInterval("timer()",1000);
	window.onresize=function(){
		_onresize();
	}
	_onresize();
	startSpecialPerformance();
	endSpecialPerformance();
	
var startTime=$(".count-down").attr("data-end-time").split('.');
	var year=parseInt(startTime[0]);
	var month=parseInt(startTime[1])-1;
	var day=parseInt(startTime[2]);
	var hour=parseInt(startTime[3]);
	var minute=parseInt(startTime[4]);
	var second=parseInt(startTime[5]);
	startTime= new Date(year,month,day,hour,minute,second);
	
	var endTime=$(".m-countdown").attr("end-time").split('.');
	var year=parseInt(endTime[0]);
	var month=parseInt(endTime[1])-1;
	var day=parseInt(endTime[2]);
	var hour=parseInt(endTime[3]);
	var minute=parseInt(endTime[4]);
	var second=parseInt(endTime[5]);
	endTime=new Date(year,month,day,hour,minute,second);
	var spArray=$(".m-countdown").attr("data-start-sp").split(',');
	if(spArray.length>0){
		for (var i=0;i<spArray.length;i++) {
			var index=parseInt(spArray[i]);
			$("body .goods-wrap:eq("+index+")").each(function(){
				$(this).attr("status","open")
			})
		}
	}
	function statusExc(){
		var newDate=new Date();
		if(startTime.getTime()>newDate.getTime()){
			$(".goods-wrap .goods").each(function(){
				var href=$(this).children("a").attr("href");
				var data_href=$(this).children("a").attr("data-href");
				var goodsWrapStatus=$(this).parents(".goods-wrap").attr("status");
				if(href!=="javascript:;"&&data_href===undefined&&goodsWrapStatus!=="open"){
					$(this).children("a").attr("data-href",href);
            		$(this).children("a").attr("href","javascript:;");
				}
          	})
		}else if((startTime.getTime()<=newDate.getTime())&&(endTime.getTime()>newDate.getTime())){
			//$(".goods-wrap .goods").find(".c-href>div:eq(1)").css("display","block").siblings().css("display","none");
			var href=$(".goods-wrap .goods").children("a").attr("data-href");
			$(".goods-wrap .goods").children("a").attr("href",href);
		}else if(endTime.getTime()<=newDate.getTime()){
			//$(".goods-wrap .goods").find(".c-href>div:eq(2)").css("display","block").siblings().css("display","none");
			$(".goods-wrap .goods").each(function(){
				var href=$(this).children("a").attr("href");
				var data_href=$(".goods-wrap .goods").children("a").attr("data-href");
				if(href==="javascript:;"&&data_href===undefined){
					$(this).children("a").attr("data-href",href);
            		$(this).children("a").attr("href","javascript:;");
				}
          	})
		}
	}
	statusExc();
	setInterval(function(){
		statusExc();
	},1000);
	
	var scrollSide=function(){
		var top =  document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		if(top<700){
			$(".side-menu").css("display","none");
		}else{
			$(".side-menu").css("display","block");
		}
	}
	$(window).scroll(function(){
		scrollSide();
	})
	scrollSide();
})(jQuery)

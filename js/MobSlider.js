/*!
* MobSlider 0.0.1
* https://github.com/hoythan/MobSlider
* 基于jQuery,jQuery-Mobile的移动端轮播效果
*/
var MobSlider = (function(){
	// Reset Slider
	var MS_Width = 0,
		MS_Reset = false,// 根据此判断是否被初始化
		MS_Paged = 0,
		MS_Layer = '',
		MS_Rolls = '',
		MS_Num   = 0,
		MS_Swipe = false // 滚动的方向,默认false左滚,true 右滚
		MS_Speed = 200; // 滚动速度
	var MSEntry = function(MS){
		// 定义Layer
		MS_Layer = MS.find('ul');
		MS_Layer.css({left: 0});
		// 判断是否被初始化
		if(!MS_Reset){
			MSReset(MS);
		}
		// 定义所需函数
		var ismouse = false,movewidth,moveplace,nextplace,layerplace,nowpaged,starttime,overtime,allmovewidth;
		// 加载对应事件
		if(ismobole()){
			MS_Layer[0].addEventListener("touchstart",handleStart,false);
			MS_Layer[0].addEventListener("touchmove",handleMove,false);
			MS_Layer[0].addEventListener("touchend",handleEnd,false);
		}else{
			// move事件在按下鼠标后注册
			MS_Layer[0].addEventListener("mousedown",handleStart,false);
			MS_Layer[0].addEventListener("mouseup",handleEnd,false);
			ismouse = true; // 标注为PC端
		}
		// 执行事件
		function handleStart(ele){
			// 定义nextplace
			if(ismouse){
				nextplace = ele.pageX;
				// 按下鼠标注册MOVE事件
				MS_Layer[0].addEventListener("mousemove",handleMove,false);
			}else{
				var touch = ele.touches[0];
				nextplace = touch.pageX;
			}
			// 设置开始时间,用于判断速度
			starttime = Date.now();
			allmovewidth = 0;
		}
		function handleMove(ele){
			// 禁用默认事件
			ele.preventDefault();
			// 获取当前的位置信息
			layerplace = parseFloat(MS_Layer.css('left'));
			// Move处理
			if(ismouse){
				moveplace = ele.pageX;
			}else{
				var touch = ele.touches[0];
				moveplace = touch.pageX;
			}
			movewidth = Math.abs(nextplace - moveplace);
			if(moveplace > nextplace){
				// Left
				layerplace += movewidth;
				MS_Swipe = false;
			}else{
				// Right
				layerplace -= movewidth;
				MS_Swipe = true;
			}
			MS_Layer.css({
				left: layerplace
			});
			// 初始化nextplace
			nextplace = moveplace;
			// 增值width
			allmovewidth += movewidth;
			// 计算移动的PAGED位置
			nowpaged = Math.round(layerplace / MS_Width);
		}
		function handleEnd(ele){
			// 判断是否为快速滑动操作
				// 首先判断是否有实质性的位置移动,
				// 再判断移动的速度\距离是否达到要求,
				// 最后根据方向±页码
			overtime = Date.now();
			if(nowpaged == MS_Paged && overtime - starttime < 300 && allmovewidth > 20){
				if(MS_Swipe){
					nowpaged -= 1;
				}else{
					nowpaged += 1;
				}
			}
			
			// 判断是否超过两页，超过则滑回去。
			if(Math.abs(nowpaged) - Math.abs(MS_Paged) > 1){
				if(MS_Swipe){
					MS_Paged -= 1;
				}else{
					MS_Paged += 1;
				}
			}else{
				// 否则定义PAGED位置
				MS_Paged = nowpaged;
			}
			// 如何超出最左边位置，则返回最左
			
			if(nowpaged > 1){
				MS_Paged = 1;
			}
			if(nowpaged < 0 - (MS_Num - 2)){
				MS_Paged = 0 - (MS_Num - 2);
			}
			MSMove(MS);
			// 弹起鼠标,注销move事件
			MS_Layer[0].removeEventListener("mousemove",handleMove,false);
		}
		// 判断是否为移动端
		function ismobole(){
			var userAgentInfo = navigator.userAgent;
			var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
			var flag = false;
			for (var v = 0;v < Agents.length;v++){
				if(userAgentInfo.indexOf(Agents[v]) > 0){
					flag = true;
					break;
				}
			}
			return flag;
		}
	}
	var MSReset = function(MS){
		MS_Width = MS.width();
		if(!MS_Reset){ // 如果还未初始化
			// 首末元素拷贝
			var MS_AF_el = MS.find('li').eq(0),
				MS_BF_el= MS.find('li').last();
				// 填充到对应位置
			MS_Layer.prepend(MS_BF_el.prop('outerHTML'));
			MS_Layer.append(MS_AF_el.prop('outerHTML'));
				// 设置对应CLASS
			MS.find('li').eq(0).addClass('MS_bf');
			MS.find('li').last().addClass('MS_af');
			MS_Paged = 0;
			MS_Reset = true;
		}
		// 排列元素
		MS.find('li').each(function(index,el) {
			$(this).css({
				left: (index - 1) * MS_Width
			});
		});
		// 获取数量
		MS_Num = MS.find('li').length;
		// 设置rolls
		MSRolls(MS);
	}
	var MSMove = function(MS){
		var moveleft = MS_Paged * MS_Width;
		MS_Layer.animate({left:moveleft},MS_Speed,function(){
			// 运行完动画后判断是否需要回到对应页面
			if(MS_Paged == 1){
				MS_Paged = 0 - (MS_Num - 3);
			}else if(MS_Paged == 0 - (MS_Num - 2)){
				MS_Paged = 0;
			}
			// 变化位置
			MS_Layer.css({
				left: MS_Paged * MS_Width
			});
			// 设置圆点
			MSRolls(MS);
		});
	}
	// 设置圆点位置
	var MSRolls = function(MS){
		if(MS_Reset){
			MS.find('.rolls').remove();
			MS.append('<div class="rolls"></div>');
			MS_Rolls = MS.find('.rolls');
			for (var i = 0; i < MS_Num - 2; i++){
				MS_Rolls.append('<span></span>');
			}
		}
		MS_Rolls.removeClass('on');
		MS_Rolls.find('span').each(function(index){
			if(index == Math.abs(MS_Paged)){
				$(this).addClass('on');
			}
		});
	}
	// 设置参数
	// var MSOption = function(){

	// }
	return{
		MSEntry : MSEntry
	};
})();
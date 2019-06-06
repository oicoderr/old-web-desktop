// 初始化拖拽
var deskContiner = document.querySelector("#deskContiner");
var fileAll = deskContiner.querySelectorAll(".file");
var DTpicker = document.querySelector("#DTpicker");
//垃圾箱
var Ogarbage = document.querySelector("#garbage");

Initial_drag();
function Initial_drag(){
	var shadow = document.querySelector("#shadow");
	var deskMask = document.querySelector("#deskMask");
	var a = 10;  //z-index 值
	deskMask.onmousedown = function(ev){
		// 选框定位
		var oriX = ev.clientX ;
		var oriY = ev.clientY ;
		shadow.style.left = oriX + "px";
		shadow.style.top = oriY + "px";
		shadow.style.display = "block";
		document.onmousemove = function(ev){
			//选框大小
			shadow.style.width = Math.abs( ev.clientX - oriX ) + "px";
			shadow.style.height = Math.abs( ev.clientY - oriY ) + "px";
			shadow.style.left = Math.min( ev.clientX,oriX ) + "px";
			shadow.style.top = Math.min( ev.clientY,oriY ) + "px";

			for(var i = 0;i<fileAll.length;i++){
				if( peng(shadow,fileAll[i]) ){//碰到
					fileAll[i].style.background = 'rgba(0,0,0,.2)';
					fileAll[i].style.borderColor = '#d6d6d7';
				}else{//没有触碰到
					fileAll[i].style.background = '';
					fileAll[i].style.borderColor = '';
				}
			}
		}

		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
			shadow.style.cssText = '';
			shadow.style.display = "none";
		}
		return false;
	}
	function peng(obj1,obj2){//返回结果如果为true，说明碰到
		var pos1 = obj1.getBoundingClientRect();
		var pos2 = obj2.getBoundingClientRect();

		return pos1.right > pos2.left && pos1.left < pos2.right && pos1.bottom > pos2.top && pos1.top < pos2.bottom;
	}
	filoderPosition();
	for(var i=0;i<fileAll.length;i++){
		fileAll[i].index = i;
		fileAll[i].onmousedown = function(ev){
			var result = [];
			var arr = [];
			var Num = 0;
			var oEvent= ev || event;
			//获取初始 file left top 值
			var DownX = this.offsetLeft;
			var DownY = this.offsetTop;
			//获取鼠标 点击 file的位置
			var disX = oEvent.clientX - this.offsetLeft;
			var disY = oEvent.clientY - this.offsetTop;
			// file的 每个数据放入json中
			for(var i=0;i<fileAll.length;i++) {
				var json={
					l:fileAll[i].offsetLeft,
					r:fileAll[i].offsetLeft+fileAll[i].offsetWidth,
					t:fileAll[i].offsetTop,
					b:fileAll[i].offsetTop+fileAll[i].offsetHeight
				}
				arr.push(json);
			}

			this.style.zIndex = a++;
			//file 排序
			Num = this.index;

			document.onmousemove = function(ev) {
				deskContiner.onmousemove = null;
				result=[];

				var oEvent = ev || event;
				// file left 小于 0  = 10
				if(fileAll[Num].offsetLeft < 0) {
					fileAll[Num].style.left = 10+"px";
				}
				//file left 大于 屏幕宽度  =  屏幕宽度
				else if(fileAll[Num].offsetLeft>deskContiner.clientWidth - fileAll[Num].clientWidth) {
					fileAll[Num].style.left = deskContiner.clientWidth - fileAll[Num].clientWidth+'px';
				}
				//file top 小于 0  =  10
				if(fileAll[Num].offsetTop < 0) {
					fileAll[Num].style.top = 10+"px";
				}
				//file left 大于 屏幕高度  =  屏幕高度
				else if(fileAll[Num].offsetTop > deskContiner.clientHeight - fileAll[Num].clientHeight) {
					fileAll[Num].style.top = deskContiner.clientHeight - fileAll[Num].clientHeight+'px';
				}

				l = fileAll[Num].offsetLeft;
				r = fileAll[Num].offsetLeft+fileAll[Num].offsetWidth;
				t = fileAll[Num].offsetTop;
				b = fileAll[Num].offsetTop+fileAll[Num].offsetHeight;

				//console.log(l,r,t,b)
				// move 时 赋值
				fileAll[Num].style.left = oEvent.clientX - disX+'px';
				fileAll[Num].style.top = oEvent.clientY - disY+'px';

				for(var i=0;i<arr.length;i++) {
					//console.log(i)  // i 触碰到谁 i 就会变成下一个  (0-3)
					// Num  0-3  computer 0  垃圾箱 1  music 2  日历 3
					//console.log(Num)
					if(i == Num) {
						result.push(false);
						continue;
					}
					else {
						if( l>arr[i].r || r<arr[i].l || t>arr[i].b || b<arr[i].t ) {
							//console.log(t,arr[i].b )
							//console.log(0)
							result.push(false)
						} else {
							result.push(true)
							for(var c=0;c<fileAll.length;c++){
								fileAll[c].style.opacity='1';/*非IE*/
								fileAll[c].style.filter='alpha(opacity='+100+')';/*IE*/
							}

							fileAll[i].style.opacity='0.3';/*非IE*/
							fileAll[i].style.filter='alpha(opacity='+30+')';/*IE*/
							//deskContiner.removeChild(fileAll[Num]);
							break;
						}
					}

				}
			};

			document.onmouseup=function() {
				document.onmousemove = null;
				document.onmouseup = null;
				for(var c=0;c<fileAll.length;c++) {
					fileAll[c].style.opacity='1';/*非IE*/
					fileAll[c].style.filter='alpha(opacity='+100+')';/*IE*/
				}
				var time_In=0;
				for(var i=0;i<arr.length;i++) {
					if(i == Num) {
						continue;
					}
					else {
						if( l>arr[i].r || r<arr[i].l || t>arr[i].b || b<arr[i].t) {
							time_In++;
						}
					}
				}
				//不可随意移动图标到指定位置，返回初始位置位置
				if(time_In == arr.length - 1) {
					fileAll[Num].style.left = DownX+'px';
					fileAll[Num].style.top = DownY+'px';
				}

				for(var i=0;i<result.length;i++) {
					console.log(result)
					if(result[i]) {
						fileAll[Num].style.left = fileAll[i].offsetLeft+'px';
						fileAll[Num].style.top = fileAll[i].offsetTop+'px';
						fileAll[i].style.left = DownX+'px';
						fileAll[i].style.top = DownY+'px';
						//console.log(DownX,DownY)
					}
				}

				if(fileAll[Num].releaseCapture) {
					fileAll[Num].releaseCapture();
				}
			};
			if(fileAll[Num].setCapture) {
				fileAll[Num].setCapture();
			}
			return false;
		}
	}
};
//  垃圾箱删除




//  其他 功能性图标"随意"拖拽
Fdrag(DTpicker);
function Fdrag(obj){
	var maxL = window.innerWidth -obj.offsetWidth;
	var maxT = window.innerHeight -obj.offsetHeight;
	//console.log(window.innerWidth)
	obj.onmousedown = function( e ){
		var disX = e.clientX - obj.offsetLeft;
		var disY = e.clientY - obj.offsetTop;
		obj.style.zIndex = 999;  // 拖拽始终在  icon图标 上面
		document.onmousemove = function( e ){
			var l = e.clientX - disX;
			var t = e.clientY - disY;
			if( l<0 ){
				l = 0;
			}
			if( l>maxL ){
				l = maxL;
			}
			if( t<0 ){
				t = 0
			}
			if( t>maxT ){
				t = maxT;
			}
			obj.style.left = l + "px";
			obj.style.top = t + "px";

		}
		document.onmouseup = function(){
			//有效边界限制
			if( obj.offsetLeft < 100){
				obj.style.left = 10 +"px";
			}
			if(obj.offsetTop<100){
				obj.style.top = 60 +"px";
			}
			if(obj.offsetLeft >= maxL){
				obj.style.left = maxL-10 +"px";
			}
			if(obj.offsetTop >= maxT){
				obj.style.top = maxT-40 +"px";
			}
			document.onmousemove = null;
		}
		return false;
	}
}
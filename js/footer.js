// footer 移入 移出效果
function MoveTo(id){
	this.F_ul = document.getElementsByClassName(id)[0];
	this.U_lis = this.F_ul.getElementsByTagName('li');
}
MoveTo.prototype.init = function(){
	var _this = this;
	for(var i = 0;i<this.U_lis.length;i++){
			this.U_lis[i].index = i;
			EventUtil.add(this.U_lis[i],'mouseenter',function(){
			_this.fnMouseenter(this);
		})
			EventUtil.add(this.U_lis[i],'mouseleave',function(){
				_this.fnMouseleave(this);
			})
	}
}
MoveTo.prototype.fnMouseenter = function(lis){
	this.U_lis[lis.index].style.borderLeft = '2px solid rgba(248,248,248,.3)';
	this.U_lis[lis.index].style.borderRight = '2px solid rgba(248,248,248,.3)';
}
MoveTo.prototype.fnMouseleave = function(lis){
	this.U_lis[lis.index].style.borderLeft = '';
	this.U_lis[lis.index].style.borderRight = '';
}

var Move = new MoveTo('icon_lists');
var Move2 = new MoveTo('Xt_icon');
Move.init();
Move2.init();
//-------------------------------------------------- 单击开始 ------------------------------------------------------
function menuClick(id){
	this.start = document.getElementsByClassName(id)[0];
	this.begin_menu = document.getElementById('menu');
	console.log(this.start)
}
menuClick.prototype.init = function(){
	var _this = this;
	EventUtil.add(this.start,'click',function(){
		_this.fnClick();
	})
}
menuClick.prototype.fnClick = function(){
	if(this.begin_menu.style.display == 'none'){
		this.begin_menu.style.display = 'block';
	}else{
		this.begin_menu.style.display = 'none';
	}

}
var click = new menuClick('start');
click.init();

// mousedown桌面遮罩  取消一切选中状态 和 隐藏 开始菜单
function deskClick(id){
	this.deskMask = document.getElementById(id);
	//console.log(this.deskMask)
}
deskClick.prototype.init = function(){
	var _this = this;
	EventUtil.add(this.deskMask,'mousedown',function(){
		_this.OneClick();
	})
};
deskClick.prototype.OneClick = function(){
	//隐藏 ->开始菜单
	var begin_menu = document.getElementById('menu');
	if(begin_menu.style.display == 'block'){
		begin_menu.style.display = "none";
	}
	// 取消桌面图标选中状态
	var fileAll = document.getElementsByClassName("file");
	for(var i = 0;i<fileAll.length;i++){
		fileAll[i].style.background = '';
		fileAll[i].style.borderColor = '';
	}

	//取消右键 菜单
	var RightMenu = document.querySelector('.RightMenu');
	RightMenu.style.display = "none";

	// 隐藏登陆/注册
	var login_wrap = document.querySelector(".login-wrap");
	var Fadeflag = true;
	function Fade() {
		//淡出效果
		this.hide = function(obj) {
			var num = 10;
			if (Fadeflag) {
				var st = setInterval(function(){
					num--;
					Fadeflag = false;
					obj.style.opacity = num/10;
					obj.style.filter = 'Alpha(Opacity='+(num/10)+')';
					if (num<=0) {
						clearInterval(st);
						Fadeflag = true;
					}
				},30);
				var Login_none = setTimeout(function(){
					if(obj.style.opacity == 0 || obj.style.filter == 'Alpha(Opacity=0)'){
						obj.style.display = "none";
						clearTimeout(Login_none);
					}
				},350)
			}
		}
	}
	var fade = new Fade();
	fade.hide(login_wrap); //淡出
}
var OneClick = new deskClick('deskMask');
OneClick.init();
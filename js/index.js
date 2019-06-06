// 桌面遮罩自适应 高度
(function adaption(){
    var deskMask = document.querySelector("#deskMask");
    deskMask.style.height =  winSize().height -38 +"px";
})()

//图片预加载
//切换桌面壁纸
function preloadimages(arr){
    var newimages=[], loadedimages=0;
    var postaction=function(){}  //此处增加了一个postaction函数，该函数被用来做为图片加载完成后的回调函数
    var arr = (typeof arr!="object")? [arr] : arr;
    function imageloadpost(){
        loadedimages++;
        if (loadedimages == arr.length){
            postaction(newimages) //加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
        }
    }
    for (var i=0; i<arr.length; i++){
        newimages[i] = new Image();
        newimages[i].src = arr[i];
        newimages[i].onload = function(){
            imageloadpost()
        };
        newimages[i].onerror = function(){
            imageloadpost()
        }
    }
    return { //此处返回一个空白对象的done方法
        done:function(f){
            postaction = f || postaction;
        }
    }
}
//确保了链式调用的实现
preloadimages(['http://dramalife.cn/img/Deskicon/lawo.png','http://dramalife.cn/img/Deskicon/xt-ie.png','http://dramalife.cn/img/Deskicon/xt-qq.png','http://dramalife.cn/img/Deskicon/admin.png','http://dramalife.cn/img/Deskicon/xt-jh.png']);
preloadimages(['http://dramalife.cn/img/imgDesk/desk-1.jpg','http://dramalife.cn/img/imgDesk/desk-2.jpg','http://dramalife.cn/img/imgDesk/desk-3.jpg','http://dramalife.cn/img/imgDesk/desk-4.jpg','http://dramalife.cn/img/imgDesk/desk-5.jpg','http://dramalife.cn/img/imgDesk/desk-6.jpg']).done(function(images){
    //alert(images.length);
    //console.log(images[0].src+" "+images[0].width);
    //构造函数
    function Lawo(id){
        this.Lawo = document.getElementById(id);
        this.body_img = document.body;
        this.disY = 0;
        this.num = 0;
    }
    Lawo.prototype.init = function(){
        var _this = this;
        EventUtil.add(this.Lawo,'mousedown',function(ev){
            var ev = ev||window.event;
            _this.fnDown(ev);
            //阻止默认事件
            EventUtil.preventDefault(event);
        },false);
    };
    Lawo.prototype.fnDown = function(ev){
        var _this = this;
        var ev = ev || window.event;
        this.disY = ev.pageY - Math.abs(this.Lawo.offsetTop);
        //console.log(this.Lawo.offsetTop,ev.pageY,this.disY);

        EventUtil.add(document,'mousemove',Move);
        function Move(ev){
            var ev = ev||window.event;
            _this.fnMove(ev);
            EventUtil.add(document,'mouseup',Up);
        }
        function Up(){
            _this.fnUp(ev,Move,Up);
        }
    };
    Lawo.prototype.fnMove = function(ev){
        if(Number(this.Lawo.style.top) >= 0){
            this.Lawo.style.top = 0 + 'px';
        }
    };
    Lawo.prototype.fnUp = function(ev,Move,Up){
        this.Lawo.style.top = '';
        this.num++;
        //console.log(this.num)
        if(this.num == images.length){
            this.num = 0;
        }
        this.body_img.style.backgroundImage = "url("+ images[this.num].src +")";
        EventUtil.remove(document,'mousemove',Move);
        EventUtil.remove(document,'mouseup',Up);
    }
    var Switch = new Lawo('Lawo');
    Switch.init();
});

// 获取本地时间
(function(){
    getTime();
    function getTime(){
        setInterval(function() {
            var time = new Date();
            // 程序计时的月从0开始取值后+1
            var DTpicker = document.querySelector("#DTpicker");
            var month = document.querySelectorAll("#DTpicker .month")[0];
            var day = document.querySelectorAll("#DTpicker .day")[0];
            var time1 = document.querySelectorAll("#DTpicker .time")[0];
            var date = document.querySelectorAll("#DTpicker .date")[0];
            var week = document.querySelectorAll("#DTpicker .week")[0];

            var m = changeNum(time.getMonth() + 1);
            var t = time.getFullYear() + "-" + m + "-"
                + time.getDate() + " " + time.getHours() + ":"
                + time.getMinutes() + ":" + time.getSeconds();
            var week1 = new Date().getDay();
            var str = '星期';
            switch (week1) {
                case 0 :
                    str += "日";
                    break;
                case 1 :
                    str += "一";
                    break;
                case 2 :
                    str += "二";
                    break;
                case 3 :
                    str += "三";
                    break;
                case 4 :
                    str += "四";
                    break;
                case 5 :
                    str += "五";
                    break;
                case 6 :
                    str += "六";
                    break;
            }
            week.innerHTML = str;
            month.innerHTML = m;
            day.innerHTML = changeNum(time.getDate());
            time1.innerHTML = changeNum(time.getHours()) + ":" + changeNum(time.getMinutes()) + ":" + changeNum(time.getSeconds());
            date.innerHTML = time.getFullYear() + "年" + m + "月" + changeNum(time.getDate())+"日";
            function changeNum(num){
                if(num<10){
                    return '0'+num;
                }
                return num;
            }
        }, 1000);
    }
})()


// 桌面 右键

OpenMenu();
function OpenMenu(){
    var getOffset = {
        top: function (obj) {
            return obj.offsetTop + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
        },
        left: function (obj) {
            return obj.offsetLeft + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
        }
    };
    //自定义右键菜单
    var RightMenu = document.querySelector(".RightMenu");
    var ul = RightMenu.querySelector('.menuList');
    var lis = ul.querySelectorAll('li');
    var deskContiner = document.querySelector("#deskContiner");
    var maxWidth = maxHeight = null;
    var maxWidth = maxHeight = null;
    //获取desk 桌面 宽高
    var aDoc = [deskContiner.offsetWidth, deskContiner.offsetHeight];

    for(var i = 0;i<lis.length;i++){
        EventUtil.add( lis[i],'mouseover',function(){
            var that = this;
            var smallMenu = that.querySelectorAll(".smallMenu")[0];
            //显示子菜单
            if (smallMenu){
                //最大显示范围
                maxWidth = aDoc[0] - smallMenu.offsetWidth ;
                maxHeight = aDoc[1] - smallMenu.offsetHeight;

                var tallW = RightMenu.offsetWidth + RightMenu.offsetLeft +  120;
                if(tallW >= aDoc[0]){
                    smallMenu.classList.remove("currR");
                    smallMenu.classList.add("currL");
                }else{
                    smallMenu.classList.remove("currL");
                    smallMenu.classList.add("currR");
                }
            };
        })
    }
    EventUtil.add(deskContiner,'contextmenu',function(ev){
        var ev = ev || window.event;
        //鼠标点的坐标
        var oX = ev.pageX;
        var oY = ev.pageY;
        //菜单出现后的位置
        RightMenu.style.display = "block";
        RightMenu.style.left = oX + "px";
        RightMenu.style.top = oY + "px";
        EventUtil.preventDefault(event);//阻止浏览器默认事件
        //ev.preventDefault();
        deskContiner.onclick = function(ev) {
            var ev = ev || window.event;
            RightMenu.style.display = "none"
        }
        RightMenu.onclick = function(ev) {
            var ev = ev || window.event;
            ev.cancelBubble = true;
        }

        //最大显示范围
        maxWidth = aDoc[0] - RightMenu.offsetWidth;
        maxHeight = aDoc[1] - RightMenu.offsetHeight;

        //防止菜单溢出 -38不可过footer区域
        RightMenu.offsetTop > maxHeight && (RightMenu.style.top = maxHeight -38 + "px");
        RightMenu.offsetLeft > maxWidth && (RightMenu.style.left = maxWidth + "px");
    });
}


// 初始化桌面文件生成

var defaluteFile = function(){
    var data = eval("("+localStorage.getItem("deskDate")+")") || deskData;
    var deskContiner = document.querySelector("#deskContiner");
    var AppBox = document.querySelector("#AppBox");
    var files = '';
    //var cnum = 10;
    for(var i=0;i<data.length;i++){
        var fileType = data[i].type;
        if(fileType === "folders") {
            files += '<div class="file folders" id="'+data[i].typeId+'">'+
                '<div class="Ricon fileIcon"></div>'+
                '<p class="fileName">'+data[i].title+'</p>'+
                '</div>';
        }else{//style="left:10px;top:'+cnum+'px;
            files += '<div class="file" id="'+data[i].typeId+'" ">'+
                '<div class="Ricon '+data[i].type+'"></div>'+
                '<p class="fileName">'+data[i].title+'</p>'+
                '</div>';
            //cnum += 100;
        }
    }

    window.onresize = function(){
        filoderPosition();
    }


    //insertAdjacentHTML  insertAdjacentText  方法 添加html
    //deskContiner.insertAdjacentHTML("beforeEnd",files);
    AppBox.insertAdjacentHTML("beforeEnd",files);
};

//文件位置
function filoderPosition(){
    var col = 1;//定义列
    var row = 0;//定义行
    var space = 100;//默认一个图标的大小
    var position = 10;//间距
    var windowH = winSize().height;
    var windowW = winSize().width;

    var num = parseInt(windowH / space);//一列显示的个数
    var num2 = parseInt(windowW / space);//一行显示个数

    var itemdoms = deskContiner.querySelectorAll(".file");
    var i = 0,len = itemdoms.length;

    console.log(num)
    //console.log(space)

    for(;i<len;i++){
        if(i >= num*col){ //控制列
            col ++;
            row = 0;
            //console.log(11)
        }
        //??*  在360浏览器，循环4次

        //console.log(row)
        move(itemdoms[i], {
                left:(space * (col-1)),
                top:(space *row)
            },
            300,
            "easeIn")
        row++;
        //console.log(row)
    }

}
defaluteFile();

//  初始化登录/注册 显示
(function Login_up(){
//初始化 “开机”  显示
    var login_wrap = document.querySelector('.login-wrap');
    login_wrap.style.display = "block";

//鼠标移入/移出 显示登录/注册导/ 工具航条
    //    调用
    var  header_menu = document.querySelector('.header_menu');
    EventUtil.add(header_menu, 'mouseenter', fnMouseen);
    EventUtil.add(header_menu, 'mouseleave', fnMouselea);
    var Fadeflag = true;
    // 移入显示
    function fnMouseen(){
        var num = 0;
        if (Fadeflag) {
            var st = setInterval(function(){
                num++;
                Fadeflag = false;
                header_menu.style.opacity = num/10;
                header_menu.style.filter = 'Alpha(Opacity='+(num/10)+')';
                if (num>=10) {
                    clearInterval(st);
                    Fadeflag = true;
                }
            },30);
        }
    }
    // 移出 隐藏
    function fnMouselea(){
        var num = 10;
        if (Fadeflag) {
            var st = setInterval(function(){
                num--;
                Fadeflag = false;
                header_menu.style.opacity = num/10;
                header_menu.style.filter = 'Alpha(Opacity='+(num/10)+')';
                if (num<=0) {
                    clearInterval(st);
                    Fadeflag = true;
                }
            },30);
        }
    }

})();

//header 区域  登录/注册按钮
(function(){
    var Admin_login = document.querySelector(".Admin_login");
    EventUtil.add(Admin_login, 'click', Click_Inup);
    function Click_Inup(){
        var login_wrap = document.querySelector('.login-wrap');
        login_wrap.style.display = "block";
        var num = 0;
        var st = setInterval(function(){
            num++;
            login_wrap.style.opacity =  num/10;
            login_wrap.style.filter = 'Alpha(Opacity='+(num/10)+')';
            if (num>=10) {
                clearInterval(st);
            }
        },30)
    }
})()

/*                                         桌面app 功能实现                                                          */

// 日历
var calendar_ = document.querySelector("#calendar_");
var calendar = document.querySelector("#calendar");
var onOff = true;
EventUtil.add(calendar_, 'dblclick', function(){
    if(onOff){
        move(calendar,{"right":35,"opacity":.9/* ,"filter":"alpha(opacity=90)" */},800,"linear");
        onOff = false;
    }else{
        move(calendar,{"right":-420,"opacity":0/* ,"filter":"alpha(opacity=0)" */},800,"linear");
        onOff = true;
    }
})

//点击桌面遮罩隐藏 日历
var deskMask = document.querySelector("#deskMask");
EventUtil.add(deskMask, 'mousedown', function(){
    if(!onOff){
        move(calendar,{"right":-420,"opacity":0/* ,"filter":"alpha(opacity=0)" */},800,"linear");
        onOff = true;
    }
});

// 音乐  伸展
var music = document.querySelector("#music");
var iframeMusic = document.querySelector("#iframeMusic");
EventUtil.add(music, 'dblclick', function(){
    move(iframeMusic,{"left":0,"opacity":1/* ,"filter":"alpha(opacity=100)" */},600,"linear");
});
// 音乐  缩回
var goback = document.querySelector("#goback");
EventUtil.add(goback, 'click', function(){
    move(iframeMusic,{ "left":winSize().width,"opacity":0/* ,"filter":"alpha(opacity=0)" */},600,"linear");
});


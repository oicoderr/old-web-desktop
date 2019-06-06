/**
 * Created by Administrator on 2017/7/18.
 */
// js 前端初步验证注册 登录 信息 question:1.用户禁用js，将无法进行初步验证信息，解决，判断禁用js ，调用服务器验证

// 获取全局变量: 获取登录->用户名&密码
var sign_in_htm = document.querySelector(".sign-in-htm"),
    sign_In_username = sign_in_htm.querySelector("#sign_In_username"),
    sign_In_passwd = sign_in_htm.querySelector("#sign_In_passwd"),
    sign_In_username_text = sign_in_htm.querySelector(".sign_In_username_text"),
    sign_In_passwd_text = sign_in_htm.querySelector(".sign_In_passwd_text"),
    sign_in = document.querySelector("#sign_in");

// 获取注册->用户名&密码
var sign_up_htm = document.querySelector(".sign-up-htm"),
    signUp_username = sign_up_htm.querySelector("#signUp_username"),
    signUp_username_text = sign_up_htm.querySelector(".signUp_username_text"),
    signUp_passwd = sign_up_htm.querySelector("#signUp_passwd"),
    signUp_passwd_text = sign_up_htm.querySelector(".signUp_passwd_text"),
    signUp_repasswd = sign_up_htm.querySelector("#signUp_repasswd"),
    signUp_repasswd_text = sign_up_htm.querySelector(".signUp_repasswd_text"),
    sign_up = document.querySelector("#sign_up");

var loginWrap = document.querySelector(".login-wrap"); //登录注册框
//获取Myuser 个人信息-》点击退出
var Myuser = document.querySelector("#Myuser");  //用户名
var Headpt = document.querySelector("#Headpt"); //头像
var login_end = document.querySelector(".login_end");  //退出按钮 
var login_Admin = document.querySelector(".login_Admin"); //用户 外框
//初始化
updateUserStatus();
function updateUserStatus() {
    var uid = getCookie('uid');
    var username = getCookie('username');
    if (uid) {
        //如果是登陆状态
        Headpt.style.display = 'inline-block'; //头像
        Myuser.innerHTML = username;  //用户名
        login_end.style.display = 'inline-block';  //退出按钮显示
        loginWrap.style.display = 'none';  //登录注册框隐藏
    } else {
        Headpt.style.display = 'none'; //头像隐藏
        Myuser.innerHTML = '';          //用户名空 
        login_end.style.display = 'none';
        loginWrap.style.display = 'block';  //登录注册框隐藏
    }
}


/*               登录 界面  js简单实现 初步验证                */
//用户框失去焦点后验证value值
EventUtil.add(sign_In_username, 'blur', oBlur_user);
function oBlur_user(){
    if (!sign_In_username.value) { //用户框value值为空
        sign_In_username_text.innerHTML = "*请输入用户名！";
        sign_In_username_text.style.color = '#ff5050';
    } else { //用户框value值不为空
        sign_In_username_text.innerHTML = "";
    }
}


//密码框失去焦点后验证value值
EventUtil.add(sign_In_passwd,'blur',oBlur_pass);
function oBlur_pass() {
    if (!sign_In_passwd.value) { //密码框value值为空
        sign_In_passwd_text.innerHTML = "*请输入密码！";
        sign_In_passwd_text.style.color = '#ff5050';
        
    } else { //密码框value值不为空
        sign_In_passwd_text.innerHTML = "";
    }
}

//用户登陆   若输入框为空，阻止提交
        /*
        用户登陆
        get/post
            guestbook/index.php
                m : index
                a : login
                username : 要登陆的用户名
                password : 登陆的密码
            返回
                {
                    code : 返回的信息代码 0 = 没有错误，1 = 有错误
                    message : 返回的信息 具体返回信息
                }
        */
EventUtil.add(sign_in, 'click', submitTest);

function submitTest() {
    if (!sign_In_username.value && !sign_In_passwd.value) { //用户框value值和密码框value值都为空
        sign_In_username_text.innerHTML = "*请输入用户名！";
        sign_In_passwd_text.innerHTML = "*请输入密码！";
        sign_In_username_text.style.color = '#ff5050';
        sign_In_passwd_text.style.color = '#ff5050';
        return false; //只有返回true表单才会提交
    }else if(!sign_In_username.value){
        sign_In_username_text.innerHTML = "*请输入用户名！";
        sign_In_username_text.style.color = '#ff5050';
        return false;
    }else if(!sign_In_passwd.value){
        sign_In_passwd_text.innerHTML = "*请输入密码！";
        sign_In_passwd_text.style.color = '#ff5050';
        return false;
    }else{
        ajax('post', 'guestbook/index.php','m=index&a=login&username='+encodeURI(sign_In_username.value)+'&password=' + sign_In_passwd.value, function(data) {
            var d = JSON.parse(data);
            if(d.code){ //密码错误显示提示文字
                sign_In_passwd_text.innerHTML = d.message;
                sign_In_passwd_text.style.color = '#ff5050';
            }else{ //密码成功显示文字样式
                sign_In_passwd_text.style.color = '#999';
                login_Admin.style.display = 'block';
                updateUserStatus();
            }
            
        })
   }
}

/*
    用户退出
    get/post
        guestbook/index.php
            m : index
            a : logout
        返回
            {
                code : 返回的信息代码 0 = 没有错误，1 = 有错误
                message : 返回的信息 具体返回信息
            }
    */
    EventUtil.add(login_end, 'click', loginOut);
        function loginOut (){
            ajax('get', 'guestbook/index.php', 'm=index&a=logout', function(data) {
            
            var d = JSON.parse(data);
            alert(d.message);
            
            if (!d.code) {
                //退出成功
                updateUserStatus();
            }
            
        });
            return false;
        }
   

/*                       注册 界面  js简单实现 初步验证                      */

//密码验证
EventUtil.add(signUp_passwd, 'blur', oBlur_pass);
var PassRe = /^[^\s]{6,16}$/;
function oBlur_pass(){  // 失去焦点
    if (!signUp_passwd.value || signUp_passwd.value == null) { //密码框value值为空
        signUp_passwd_text.innerHTML = "*密码不能为空或者空格！";
        signUp_passwd_text.style.color = '#ff5050';
        return false;
    }else if(PassRe.test(signUp_passwd.value)){ //用户框value值不为空 并且符合 正则 re
        signUp_passwd_text.innerHTML = "密码可以使用";
        signUp_passwd_text.style.color = '#999';
    }else{
        signUp_passwd_text.innerHTML = "6-16位字符（字母、数字、特殊符号）,区分大小写";
        signUp_passwd_text.style.color = '#ff5050';
    }
}

//重复密码验证
EventUtil.add(signUp_repasswd, 'blur', oBlur_repass);
function oBlur_repass(){  // 失去焦点
    if (signUp_passwd.value != signUp_repasswd.value) { //
        signUp_repasswd_text.innerHTML = "*对不起!重复密码不等于登录密码！请重新输入！";
        signUp_repasswd_text.style.color = '#ff5050';
        return false;
    }else if(!signUp_repasswd.value || signUp_repasswd.value == null){
        signUp_repasswd_text.innerHTML = "*对不起!重复密码能为空！请重新输入！";
        signUp_repasswd_text.style.color = '#ff5050';
        return false;
    }else{
        signUp_repasswd_text.innerHTML = "重复密码正确！";
        signUp_repasswd_text.style.color = '#999';
    }
}

//验证用户名
    /*
    验证用户名
    get
        guestbook/index.php
            m : index
            a : verifyUserName
            username : 要验证的用户名
        返回
            {
                code : 返回的信息代码 0 = 没有错误，1 = 有错误
                message : 返回的信息 具体返回信息
            }
    */
EventUtil.add(signUp_username, 'blur', HD_oBlur_user);
function HD_oBlur_user(){
    ajax('get','guestbook/index.php','m=index&a=verifyUserName&username='+ this.value,function(data){
        var d = JSON.parse(data);
        signUp_username_text.innerHTML = d.message;

        if(d.code){
            signUp_username_text.style.color = '#ff5050';
        }else{
            signUp_username_text.style.color = '#999';
        }
    })
}

//用户注册
    /*
    用户注册
    get/post
        guestbook/index.php
            m : index
            a : reg
            username : 要注册的用户名
            password : 注册的密码
        返回
            {
                code : 返回的信息代码 0 = 没有错误，1 = 有错误
                message : 返回的信息 具体返回信息
            }
    */
EventUtil.add(sign_up,'click',submitTest1);
function submitTest1(){
    if(!signUp_username.value || signUp_username.value == null){
        signUp_username_text.innerHTML = "*对不起用户名不能为空！请重新输入！"
        signUp_username_text.style.color = '#ff5050';
        return false;
    }else if(!signUp_passwd.value || signUp_passwd.value == null){
        signUp_passwd_text.innerHTML = "对不起密码不能为空！请重新输入";
        signUp_passwd_text.style.color = '#ff5050';
        return false;
    }else if(!signUp_repasswd.value || signUp_repasswd.value == null){
        signUp_repasswd_text.innerHTML = "*对不起!重复密码能为空！请重新输入！";
        signUp_repasswd_text.style.color = '#ff5050';
        return false;
    }else if (signUp_passwd.value != signUp_repasswd.value) { //
        signUp_repasswd_text.innerHTML = "*对不起!重复密码不等于登录密码！请重新输入！";
        signUp_repasswd_text.style.color = '#ff5050';
        return false;
    }else{
        signUp_repasswd_text.innerHTML = "重复密码正确！";
        signUp_repasswd_text.style.color = '#999';

        ajax('post', 'guestbook/index.php', 'm=index&a=reg&username='+encodeURI(signUp_username.value)+'&password=' + signUp_passwd.value, function(data) {
            var d = JSON.parse(data);
            if(d.code){
                signUp_username_text.style.color = '#ff5050';
            }else{
                signUp_username_text.style.color = '#999';
                alert("注册成功！")
                // 注册成功后直接显示 *已经登录* 状态
                ajax('post', 'guestbook/index.php','m=index&a=login&username='+encodeURI(signUp_username.value)+'&password=' + signUp_passwd.value, function(data) {
                    var d = JSON.parse(data);
                    updateUserStatus(); 
                })
                //清空注册信息
                signUp_username.value = '';
                signUp_passwd.value = '';
                signUp_repasswd.value = '';
                //登录窗口填写登录信息  延迟1s 获得
                var time = setTimeout(function(){
                    sign_In_username.value = Myuser.innerHTML;
                    console.log(Myuser.innerHTML)
                },1000)
            }
        });
    }
}

function getCookie(key) {
    var arr1 = document.cookie.split('; ');
    for (var i=0; i<arr1.length; i++) {
        var arr2 = arr1[i].split('=');
        if (arr2[0]==key) {
            return arr2[1];
        }
    }
}
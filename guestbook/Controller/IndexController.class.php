<?php
/**
 * @ controller Index.class.php
 * @ zmouse@vip.qq.com
 */

defined('IN_APP') or exit('Denied Access!');

class IndexController extends Controller {

	public function index() {
		echo '<p>欢迎</p>';
		//$result = $this->db->get("select * from users", 1);
		//dump($result);
	}

	/**
	 * @ interface 用户名验证
	 */
	public function verifyUserName() {
		
		$username = trim(isset($_REQUEST['username']) ? $_REQUEST['username'] : '');
		
		switch ($this->_verifyUserName($username)) {
			case 0:
				$this->sendByAjax(array('message'=>'恭喜你，该用户名可以注册！'));
				break;
			case 1:
				$this->sendByAjax(array('code'=>1,'message'=>'用户名长度不能小于3个或大于16个字符！'));
				break;
			case 2:
				$this->sendByAjax(array('code'=>2,'message'=>'对不起，该用户名已经被注册了！'));
				break;
			default:
				break;
		}
		
	}

	/**
	 * @ interface 用户注册
	 */
	public function reg() {
		$username = trim(isset($_REQUEST['username']) ? $_REQUEST['username'] : '');
		$password = trim(isset($_REQUEST['password']) ? $_REQUEST['password'] : '');
		$avatar = trim(isset($_REQUEST['avatar']) && in_array($_REQUEST['avatar'], array(1,2,3,4,5,6,7,8,9)) ? intval($_REQUEST['avatar']) : 1);

		if ($this->_verifyUserName($username) !== 0 || strlen($password)<6 || strlen($password) > 16) {
			$this->sendByAjax(array('code'=>1,'message'=>'注册失败！'));
		}
		$password = md5($password);
		if (false === $this->db->query("INSERT INTO `users` (`username`, `password`, `avatar`) VALUES ('{$username}', '{$password}', {$avatar})")) {
			$this->sendByAjax(array('code'=>1,'message'=>'注册失败！'));
		} else {
			$this->sendByAjax(array('message'=>'注册成功！'));
		}
	}


	/**
	 * @ 用户登陆
	 */
	public function login() {
		$username = trim(isset($_REQUEST['username']) ? $_REQUEST['username'] : '');
		$password = trim(isset($_REQUEST['password']) ? $_REQUEST['password'] : '');

		if (isset($_COOKIE['uid'])) {
			$this->sendByAjax(array('code'=>1,'message'=>'你已经登陆过了！'));
		}

		if ($rs = $this->db->get("SELECT * FROM `users` WHERE `username`='{$username}'")) {
			if ($rs['password'] != md5($password)) {
				$this->sendByAjax(array('code'=>1,'message'=>'密码错误，请重新输入！'));
			} else {
				setcookie('uid', $rs['uid'], time() + 3600*60, '/');
				setcookie('username', $rs['username'], time() + 3600*60, '/');
				$this->sendByAjax(array('code'=>0,'message'=>'登陆成功！'));
			}
		} else {
			$this->sendByAjax(array('code'=>1,'message'=>'登陆失败，请检查用户名是否注册！'));
		}
	}

	/**
	 * @ 用户退出
	 */
	public function logout() {
		if (!isset($_COOKIE['uid'])) {
			$this->sendByAjax(array('code'=>1,'message'=>'你还没有登陆！'));
		} else {
			setcookie('uid', 0, time() - 3600*60, '/');
			$this->sendByAjax(array('code'=>0,'message'=>'退出成功！'));
		}
	}
	/**
	 * @ 用户名验证
	 */
	private function _verifyUserName($username='') {
		if (strlen($username) < 3 || strlen($username) > 16) {
			return 1;
		}
		$rs = $this->db->get("SELECT `username` FROM `users` WHERE `username`='{$username}'");
		if ($rs) return 2;
		return 0;
	}
}
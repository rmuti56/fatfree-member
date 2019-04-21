<?php

// Kickstart the framework
$f3=require('lib/base.php');
$f3->set('AUTOLOAD','api/');
// $f3->set('AUTOLOAD', 'lib/access.php');
$f3->set('DEBUG',1);
if ((float)PCRE_VERSION<7.9)
	trigger_error('PCRE version is out of date');

// Load configuration
$f3->config('config.ini');

$f3->route('GET /',
	function($f3) {
		$classes=array(
			'Base'=>
				array(
					'hash',
					'json',

					'mbstring'
				),
			'Cache'=>
				array(
					'apc',
					'apcu',
					'memcache',
					'memcached',
					'redis',
					'wincache',
					'xcache'
				),
			'DB\SQL'=>
				array(
					'pdo',
					'pdo_dblib',
					'pdo_mssql',
					'pdo_mysql',
					'pdo_odbc',
					'pdo_pgsql',
					'pdo_sqlite',
					'pdo_sqlsrv'
				),
			'DB\Jig'=>
				array('json'),
			'DB\Mongo'=>
				array(
					'json',
					'mongo'
				),
			'Auth'=>
				array('ldap','pdo'),
			'Bcrypt'=>
				array(
					'mcrypt',
					'openssl'
				),
			'Image'=>
				array('gd'),
			'Lexicon'=>
				array('iconv'),
			'SMTP'=>
				array('openssl'),
			'Web'=>
				array('curl','openssl','simplexml'),
			'Web\Geo'=>
				array('geoip','json'),
			'Web\OpenID'=>
				array('json','simplexml'),
			'Web\Pingback'=>
				array('dom','xmlrpc')
		);
		$f3->set('classes',$classes);
		$f3->set('content','welcome.htm');
		$f3->set('menu','menu.htm');
		echo View::instance()->render('layout.htm');
	}
);

//หน้าแสดงสมาชิก
$f3->route('GET /userref',
	function($f3) {
		$logined_email = $f3->get('SESSION.email');
		$logined_role = $f3->get('SESSION.role');
		if ($logined_email != '' && ($logined_role == '1' || $logined_role == '2')) {
			$f3->set('menu','menu.htm');
			$f3->set('content','userref.htm');
			echo View::instance()->render('layout.htm');
		} 
		else if($logined_email != ''){
			$f3->reroute('/');
		}else {
			$f3->reroute('/logout');
		}
		
	}
);
//หน้า เพิ่มหรือแก้ไขสมาชิก
$f3->route('GET /addmember',
function($f3){
	$logined_email = $f3->get('SESSION.email');
	$logined_role = $f3->get('SESSION.role');
	if ($logined_email != '' && $logined_role == '1') {
		$f3->set('menu','menu.htm');
		$f3->set('content','addmember.htm');
		echo View::instance()->render('layout.htm');
	} else if($logined_email != ''){
		$f3->reroute('/userref');
	}
		else {
		$f3->reroute('/logout');
	}
} );

$f3->route('GET /login',
function($f3){
	$f3->set('menu','menu.htm');
		$f3->set('content','login.htm');
		echo View::instance()->render('layout.htm');
	} );

$f3->route('GET /logout',
function($f3){
	$f3->set('SESSION.email', '');
	$f3->reroute('/login');
} );

$f3->route('GET /register',
function($f3){
	$f3->set('menu','menu.htm');
		$f3->set('content','register.htm');
		echo View::instance()->render('layout.htm');
} );



//แสดงข้อมูลสมาชิก
$f3->route('GET /members','Api->getUsersAll');
$f3->route('GET /searchMember/@search/@key','Api->getUsersAll');
//ค้นหาข้อมูล

//เข้าสู่ระบบ
$f3->route('POST /login','Api->login');

//สมัครสมาชิก
$f3->route('POST /register','Api->register');

$f3->route('POST /delete','Api->delete');

$f3->route('GET /getUpdate/@id','Api->getUpdate');

$f3->route('POST /update','Api->update');
// if(password_verify($password, $user->password)) {
// 	$this->f3->set('SESSION.user', $user->username);
// 	$this->f3->reroute('/');
// } else {
// 	$this->f3->reroute('/login');
// }

$f3->run();

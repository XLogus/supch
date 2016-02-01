<?php
require('../wp-load.php');
require('JWT.php');

$creds['user_login'] = isset ($_POST['email']) ? $_POST['email']  : '';
$creds['user_password'] = isset ($_POST['password']) ? $_POST['password']  : ''; 
$creds['remember'] = false;

$user = wp_signon($creds, true);
if(empty($creds['user_login']) || empty($creds['user_password']) || is_wp_error($user)){
	//header("HTTP/1.0 404 Not Found");
	echo json_encode(
		array(
			"code" => 1, 
			"response" => array(
			"msg" => 'Usuario o clave incorrectos '.$creds['user_login']
			)
		)
	);
} else {
	/*
	// Generamos el Token		
	$private_key = "46196053844814367107123";
	$client_id   = $user->user_nicename;
	$user_id     = $user->ID;	
	$iat = time();
	$exp = time() + 20;
	
	$header = '{"typ":"JWT", "alg":"HS256"}';
	
	$payload = array(
		"iss" => $client_id,
		"iat" => $iat,
		"exp" => $exp
	);
	$payload2 = json_encode($payload);

	$JWT = new JWT;
	$token = $JWT->encode($header, $payload2, $private_key);
	*/
	
	$private_key = "46196053844814367107123";
	$client_id   = $user->user_nicename;
	$user_id     = $user->ID;	
	$user_email   = $user->user_email;
	$iat = time();
	$exp = time() + 24*3600*365;	// 365 dias dura el token
	
	$payload = array(
		"iss" => $client_id,
		"iat" => $iat,
		"exp" => $exp,		
		"uid" => $user_id,
		"mail" => $user_email,
	);
	
	$JWT = new JWT;
	$token = $JWT->encode($payload, $private_key);	
	
	echo json_encode(
		array(
			"code" => 0, 
			"response" => array(
				"token" => $token
			)
		)
	);
}
?>
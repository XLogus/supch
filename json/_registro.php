<?php
require('../wp-load.php');
require('JWT.php');

$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$email = $_POST['email'];
$password = $_POST['password'];
$phone = '';


if(isset($nombre) && $nombre!="") {
	if(tgt_validate_email($email) && !email_exists($email)) {
		$diplay_name = explode('@', $email);
		$userdata = array(
			'user_login' => $email,
			'user_pass' => $password,
			'user_email' => $email,
			'display_name' => $nombre.' '.$apellido,
			'user_nicename' => $nombre.' '.$apellido,
			'first_name' => $nombre,                    
			'last_name' => $apellido,                    
			'role'	=> 'userapp'                   
		);	
		
		// Registramos al nuevo usuario
		$user_ID = wp_insert_user($userdata);   
		update_user_meta( $user_ID, 'cliente_phone', $phone ); 
		
		if($user_ID != "") {
			$private_key = "46196053844814367107123";
			$client_id   = $nombre.' '.$apellido;
			$user_id     = $user_ID;	
			$iat = time();
			$exp = time() + 24*3600*365;	// 365 dias dura el token
			
			$payload = array(
				"iss" => $client_id,
				"iat" => $iat,
				"exp" => $exp
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
	}
}



function tgt_validate_email($email) {
    $regex = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/'; 
  return
	is_string($email) &&
	!empty($email) &&
	//eregi("^[a-z0-9_-]+[a-z0-9_.-]*@[a-z0-9_-]+[a-z0-9_.-]*\.[a-z]{2,5}$", $email);
    preg_match($regex, $email);
}
?>
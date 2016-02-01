<?php
function tgt_validate_email($email) {
    $regex = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/'; 
  return
	is_string($email) &&
	!empty($email) &&
	//eregi("^[a-z0-9_-]+[a-z0-9_.-]*@[a-z0-9_-]+[a-z0-9_.-]*\.[a-z]{2,5}$", $email);
    preg_match($regex, $email);
}

function recoger_banner($cual) {
	$slider = "";
	if($cual == "home_principal") { $pid = 86;	}	
	if($cual == "home_footer") { $pid = 83;	}
	if($cual == "super_principal") { $pid = 88;	}
	if($cual == "super_footer") { $pid = 85;	}
	
	// Buscamos el banner
	$sliders=get_post_meta($pid,'mkt_re_',true);
	if($sliders) {
		shuffle($sliders);
		$slider = $sliders[0]['mkt_image_imagen']['url'];
	}
	return $slider;
}
?>
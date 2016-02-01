<?php
require('../wp-load.php');
require('functions.php');

$pixelratio = $_GET['pixelratio'];

$args = array(
	'post_type'  => 'mk_locacion',
	'posts_per_page' => 600
);
$my_query = new WP_Query( $args );
if ( $my_query->have_posts() ) {
	while ( $my_query->have_posts() ) {
		$my_query->the_post();
		$pid = get_the_ID();
		
			
		$estanco_titulo = get_the_title();
		$estanco_direccion = get_post_meta( $pid, 'estanco_direccion', true );
		$estanco_localidad = get_post_meta( $pid, 'estanco_localidad', true );
		$estanco_codigo2 = get_post_meta( $pid, 'estanco_codigo2', true );
		$estanco_latitud = get_post_meta( $pid, 'estanco_latitud', true );
		$estanco_longitud = get_post_meta( $pid, 'estanco_longitud', true );
		$terms=wp_get_post_terms($pid,'tipo_lista');
		
		if($pixelratio > 1.5) {
			$iconimg=($terms['0']->term_id=='3')?'img/marker-rojo@2x.png':'img/marker-negro@2x.png';
			$icon = array(
				'url' => $iconimg,
				'size' => [30, 41],				
				'scaledSize' => [15, 21],
				'origin' => [0,0],
				'anchor' => [15, 20]				
			);		
		} else {
			$icon=($terms['0']->term_id=='3')?'img/marker-rojo.png':'img/marker-negro.png';
		}
		
		

		$json[] =
			array(
			'id' => $pid,
			//'direccion' =>  $estanco_direccion.' '.$localidad,
			'lat' => $estanco_latitud,
			'lng' => $estanco_longitud,
			//'url'=> get_the_permalink(),
			'titulo'=>$estanco_titulo,
			//'contenido'=>str_replace( array( "\n", "\r" ), array( "<br>" ), get_the_content()),
			//'dispo'=>$estanco_dispo,
			//'img'=>wp_get_attachment_image_src(get_post_thumbnail_id($pid),'loca-thumb'),
			'icon'=>$icon,
			//'imgbig'=>wp_get_attachment_image_src(get_post_thumbnail_id($pid),'large')
		);
	}
} else {        
    $json["success"] = 0;
    $json["message"] = 'No se encontraron datos '.$db->last_query();
    die(json_encode($json)); 
}


// Generar banners
$banner_principal = recoger_banner('home_principal');
$banner_footer = recoger_banner('home_footer');

$banners[] = array(
	"banner_principal" => $banner_principal,
	"banner_footer" => $banner_footer
);

wp_reset_query();
echo $_GET['callback'].'({"items":'. json_encode($json).', "banners":'.json_encode($banners).'})';
?>
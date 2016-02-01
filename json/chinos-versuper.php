<?php
require('../wp-load.php');
require('functions.php');

$id_tienda = $_GET['id_tienda'];

$args = array(
	'post_type'  => 'mk_locacion',
	'p' => $id_tienda	
);
$my_query = new WP_Query( $args );
if ( $my_query->have_posts() ) {
	while ( $my_query->have_posts() ) {
		$my_query->the_post();
		$pid = get_the_ID();
		
		// Recoger tipo de comercio
		$terms=wp_get_post_terms($post->ID,'tipo_lista');		
		
		// Recoger sliders
		$sliders=get_post_meta('89','mkt_re_',true);
		if(!empty($sliders)) {
			foreach($sliders as $slider){
				$banners[]['image'] = $slider['mkt_image_imagen']['url'];
			}
		}
		
		$estanco_titulo = get_the_title();
		$estanco_direccion = get_post_meta( $pid, 'estanco_direccion', true );
		$estanco_localidad = get_post_meta( $pid, 'estanco_localidad', true );
		$estanco_codigo2 = get_post_meta( $pid, 'estanco_codigo2', true );
		$estanco_latitud = get_post_meta( $pid, 'estanco_latitud', true );
		$estanco_longitud = get_post_meta( $pid, 'estanco_longitud', true );		
		$icon=($terms['0']->term_id=='3')?get_bloginfo('template_directory').'/img/marker-rojo.png':get_bloginfo('template_directory').'/img/marker-negro.png';
		$icon2=($terms['0']->term_id=='3')?get_bloginfo('template_directory').'/img/icon-chino.png':get_bloginfo('template_directory').'/img/icon-chino-negro.png';
		$lista = ($terms['0']->term_id=='3')?'Lista Roja':'Lista Negra';		
		$lista_tipo = ($terms['0']->term_id=='3')?'rojo':'negro';		
		$horario=get_post_meta($post->ID,'estanco_horario',true);
		$tel=get_post_meta($post->ID,'estanco_telefono',true);
		$pcuidados=get_post_meta($post->ID,'estanco_precios_cuidados',true);
		$delivery=get_post_meta($post->ID,'estanco_delivery',true);
		$mpago=get_post_meta($post->ID,'estanco_medios_de_pago',true);
		$serv=get_post_meta($post->ID,'estanco_servicios',true);
		$thumb = wp_get_attachment_image_src(get_post_thumbnail_id($pid),'loca-thumb');
		
		// Recoger comentarios
		$args2 = array(	
			'post_id' => $id_tienda,
			'status' 	=> 'approve',
		);
		$comentariosx = get_comments($args2);		
		foreach($comentariosx as $comentario) {
			// Encontrar hace cuanto
			$comment_date = $comentario->comment_date;
			$comment_diferencia = time() - strtotime($comment_date); 
			$comment_dias = round($comment_diferencia / 86400 );
			if($comment_dias == 0) { $comment_cuanto = "hoy"; }
			if($comment_dias == 1) { $comment_cuanto = "ayer"; }
			if($comment_dias > 1) { $comment_cuanto = "hace ".$comment_dias." dias"; }
			
			// Encontrar ranking
			$comment_rating = get_comment_meta( $comentario->comment_ID, 'crfp-rating', true ); 
			
			$comentarios[] = array(
				'comment_id' => $comentario->comment_ID,
				'comment_author' => $comentario->comment_author,
				'comment_content' => $comentario->comment_content,
				'comment_date' => $comment_cuanto,
				'comment_rating' => $comment_rating,
			);
		}
		
		$rank_comentarios = get_post_meta($id_tienda, 'crfp-average-rating', true);		
		$nro_comentarios = get_comments_number( $id_tienda );
		

		$json[] =
			array(
			'id' => $pid,
			'direccion' =>  $estanco_direccion.' '.$localidad,
			'lat' => $estanco_latitud,
			'lng' => $estanco_longitud,
			'url'=> get_the_permalink(),
			'titulo'=>$estanco_titulo,
			'contenido'=>str_replace( array( "\n", "\r" ), array( "<br>" ), get_the_content()),
			'dispo'=>$estanco_dispo,
			'img'=> $thumb[0],
			'icon'=>$icon,
			'icon2'=>$icon2,
			'imgbig'=>wp_get_attachment_image_src(get_post_thumbnail_id($pid),'large'),
			'lista' => $lista,
			'lista_tipo' => $lista_tipo,
			'banners' => $banners,
			'horario' => $horario,
			'telefono' => $tel,
			'pcuidados' => $pcuidados,
			'delivery' => $delivery,
			'mpago' => $mpago,
			'serv' => $serv,
			'nro_comentarios' => $nro_comentarios,
			'rank_comentarios' => $rank_comentarios,
			'comentarios' => $comentarios
		);
	}
} else {        
    $json["success"] = 0;
    $json["message"] = 'No se encontraron datos '.$db->last_query();
    die(json_encode($json)); 
}

// Generar banners
$banner_principal = recoger_banner('super_principal');
$banner_footer = recoger_banner('super_footer');

$banners2[] = array(
	"banner_principal" => $banner_principal,
	"banner_footer" => $banner_footer
);

wp_reset_query();
echo $_GET['callback'].'({"items":'. json_encode($json).', "banners":'.json_encode($banners2).'})';
?>
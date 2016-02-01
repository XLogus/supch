<?php
//require('../wp-load.php');
require('../wp-blog-header.php');
status_header(200);
nocache_headers();
require('functions.php');

$postID = $_POST['id_tienda'];
$userID = $_POST['user_id'];
$author = $_POST['author'];
$email = $_POST['email'];
$comment = $_POST['comment'];
$ratingvalue = $_POST['rating'];

custom_save_comment_wp($postID, $userID, $author, $email, $comment, $ratingvalue);
$json["success"] = 1;
$json["message"] = 'Datos guardados ';
$json["rating"] = $ratingvalue;
add_comment_meta(18, 'crfp-rating', 4, true);
echo $_GET['callback'].'({'.json_encode($json).'})';
	

function custom_save_comment_wp($postID, $userID, $author, $email, $comment, $ratingvalue){    	
	remove_all_actions( 'comment_post', 1 );
	$_POST['crfp-rating'] = $ratingvalue;

	$commentdata = array(	
		'comment_post_ID' => $postID, 	
		'comment_author' => $author,  	
		'comment_author_email' => $email,  	
		//'comment_author_url' => 'http://example.com',  	
		'comment_content' => $comment,  	
		'comment_type' => '', 	
		'comment_parent' => 0, 	
		'user_id' => $userID, );
		
		/*Graba el comentario y me da el ID*/
		$commentID = wp_new_comment( $commentdata );
		/*Añade el meta con el rating*/
		add_comment_meta($commentID, 'crfp-rating', $ratingvalue, true);
		//add_comment_meta($commentID, 'crfp-rating', 4, true);    
		/*Actualiza el total y el promedio del rating*/    
		$comments = get_comments(array(			
			'post_id' 	=> $postID,			
			'status' 	=> 'approve',		
		));				
		$totalRating = 0;		
		$totalRatings = 0;        
		$averageRating = 0;        
		if (is_array($comments) AND count($comments) > 0) {			
			foreach ($comments as $comment) { 				
				$rating = get_comment_meta($comment->comment_ID, 'crfp-rating', true);				
				if ($rating > 0) {					
					$totalRatings++;					
					$totalRating += $rating;				
				}	        
			}	        	        
			$averageRating = (($totalRatings == 0 OR $totalRating == 0) ? 0 : round(($totalRating / $totalRatings), 0));        }        
			update_post_meta($postID, 'crfp-total-ratings', $totalRatings);        
			update_post_meta($postID, 'crfp-average-rating', $averageRating);        
			return true;
	}
?>
'use strict';

myApp.controller('TiendaCtrl', function ($scope, $http, $location, $routeParams, $rootScope, store, jwtHelper, CONFIG, $sce) {	
	
	var token = store.get("token") || null;
	
	if(!token) {
		$scope.logeado = false;
	} else {
		$scope.logeado = true;
	}
	
	
	$scope.comentario="2";
	$scope.rankcomentario="2";
	
	$scope.id_tienda = $routeParams.tiendaId;
	$scope.delay = 2000;
	$scope.animation = 'animation-fade';	
	
	$scope.cerrar_banner = function(event, cual) {
		$scope.showbanner = true;
	}
	
	
	$scope.slides = [
                {'title': 'hell', 'class': 'animation-slide', 'image': 'images/image1.png'},
                {'title': 'sadas', 'class': 'animation-fade', 'image': 'images/image2.png'}
            ];
	
	$http({
        method: "JSONP", 
        url: 'http://superchinos.com.ar/nuevo/json/chinos-versuper.php?callback=JSON_CALLBACK',
        params: { 'id_tienda': $scope.id_tienda }, 
        isArray: true}).
		success(function(data, status) {
			$scope.status = status;
			$scope.item = data.items[0]; 			
			$scope.slides = data.items[0].banners;
			$scope.comentarios = data.items[0].comentarios;
			$scope.rank = data.items[0].rank_comentarios;
			
			var banners = data.banners;
			$rootScope.home_banner_footer = banners[0].banner_footer;
			$rootScope.home_banner_principal = banners[0].banner_principal;
			
			//console.log(JSON.stringify(data.items, null, 4));			
		});  

	// Enviar comentarios
	$scope.enviar_comentario = function(comen) {
		//alert("enviado comentario "+ comen.comentario + comen.rankcomentario);
		alert("Gracias! tu comentario ha sido enviado");
		$scope.token = store.get("token");
		var tokenPayload = jwtHelper.decodeToken($scope.token);
		//console.log(tokenPayload);
		$scope.user_id = tokenPayload.uid;
		$scope.user_author = tokenPayload.iss;
		$scope.user_email = tokenPayload.mail;
		
		$http({
			method: 'POST',
			skipAuthorization: true,
			url: CONFIG.APIURL+'/save_comment.php?callback=JSON_CALLBACK',
			data: "id_tienda=" + $scope.item.id + "&user_id=" + $scope.user_id + "&author=" + $scope.user_author + "&email="+$scope.user_email + "&comment="+comen.comentario + "&rating="+comen.rankcomentario,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status) {
			//location.reload(); 		
		});  		
		return false;
	}
});	
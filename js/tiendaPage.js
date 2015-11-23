'use strict';

myApp.controller('TiendaCtrl', function ($scope, $http, $location, $routeParams) {	
	
	$scope.comentario="2";
	$scope.rankcomentario="2";
	
	$scope.id_tienda = $routeParams.tiendaId;
	$scope.delay = 2000;
	$scope.animation = 'animation-fade';	
	
	
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
			
			console.log(JSON.stringify(data.items, null, 4));			
		});  

	// Enviar comentarios
	$scope.enviar_comentario = function(comen) {
		alert("enviado comentario "+ comen.comentario + comen.rankcomentario);
		return false;
	}
});	
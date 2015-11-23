myApp.controller('RegistroCtrl', ['$scope','CONFIG', 'authFactory', 'jwtHelper', 'store', '$location', '$http', function($scope, CONFIG, authFactory, jwtHelper, store, $location, $http){
	
	$scope.registro = function()
    {
		
		
		
		
		
		$http({
			method: 'POST',
			skipAuthorization: true,
			url: CONFIG.APIURL+'/registro.php',
			data: "uuid" + "nombre=" + $scope.user.nombre + "&password=" + $scope.user.password + "&apellido=" + $scope.user.apellido + "&email="+$scope.user.email,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status) {
			//store.set('token', res.data.response.token);		
			store.set('token', data.response.token);		
			$location.path("/home");
		});  		
    }
}])
myApp.controller('RegistroCtrl', ['$scope','CONFIG', 'authFactory', 'jwtHelper', 'store', '$location', '$http', function($scope, CONFIG, authFactory, jwtHelper, store, $location, $http){
	
	$scope.registro = function()
    {
		//alert($scope.user.nombre);		
		
		$http({
			method: 'POST',
			skipAuthorization: true,
			url: CONFIG.APIURL+'/registro.php',
			data: "nombre=" + $scope.user.nombre + "&password=" + $scope.user.password + "&apellido=" + $scope.user.apellido + "&email="+$scope.user.email,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status) {
			//store.set('token', res.data.response.token);		
			$code = data.code;
			if($code == 1) { 
				store.set('token', data.response.token);		
				$location.path("/home");
			} else {
				$scope.error = data.response.token;
			}
		});  		
    }
}])
myApp.controller('LogoutCtrl', ['$scope','CONFIG', 'authFactory', 'jwtHelper', 'store', '$location', function($scope, CONFIG, authFactory, jwtHelper, store, $location)
{
	store.remove('token');
	$location.path("/home");
}])
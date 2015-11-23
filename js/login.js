myApp.controller('LoginCtrl', ['$scope','CONFIG', 'authFactory', 'jwtHelper', 'store', '$location', function($scope, CONFIG, authFactory, jwtHelper, store, $location)
{
	$scope.login = function(user)
    {
        authFactory.login(user).then(function(res)
        {
            if(res.data && res.data.code == 0)
            {
                store.set('token', res.data.response.token);
                $location.path("/home");
            } else if(res.data.code == 1) {
				$scope.error = 'Usuario o clave incorrectos';
			}
        });
    }
}])
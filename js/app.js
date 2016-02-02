'use strict';
var myApp = angular.module('myApp', [
	'ngRoute', 
	'mobile-angular-ui', 
	'app.homePages', 	
	'ngAnimate',
	'bzSlider',
	'ngMap',
	'tabs',
	'angular-jwt', 
	'angular-storage',
	'ngSanitize'
]);

myApp.constant('TPL_PATH', 'templates');
myApp.constant('CONFIG', {
	APIURL: "http://superchinos.com.ar/nuevo/json"	
});

myApp.config(["$routeProvider", "$httpProvider", "jwtInterceptorProvider", "TPL_PATH", function ($routeProvider, $httpProvider, jwtInterceptorProvider, TPL_PATH) {
	
	jwtInterceptorProvider.urlParam = 'access_token';
	jwtInterceptorProvider.tokenGetter = ['myService', function(myService) {
		myService.doSomething();
		return localStorage.getItem('id_token');
	}];
	
	
	// Home
    $routeProvider.when('/',{
		redirectTo: "/home"
    });
	
	$routeProvider.when('/login',{
		controller : 'LoginCtrl',
		templateUrl : TPL_PATH + '/login.html',
		title:'Login',
		slug:'login',
		authorization: false
    });
	
	$routeProvider.when('/registro',{
		controller : 'RegistroCtrl',
		templateUrl : TPL_PATH + '/registro.html',
		title:'Registro',
		slug:'registro',
		authorization: false
    });
	
	$routeProvider.when('/phonegap',{
		controller : 'PhoneCtrl',
		templateUrl : TPL_PATH + '/phonegap.html',
		title:'Phonegap',
		slug:'phonegap',
		authorization: false
    });
	
	$routeProvider.when('/home',{
		controller : 'HomeCtrl',
		templateUrl : TPL_PATH + '/home.html',
		title:'Home',
		slug:'home',
		authorization: false
		//authorization: true
    });
	
	$routeProvider.when('/about',{
		controller : 'AboutCtrl',
		templateUrl : TPL_PATH + '/about.html',
		title:'Sobre la App',
		slug:'about',
		authorization: false
    });
	
	$routeProvider.when('/logout',{
		controller : 'LogoutCtrl',
		templateUrl : TPL_PATH + '/logout.html',
		title:'Salir',
		slug:'logout',
		authorization: false
    });
	
	// Tienda
    $routeProvider.when('/tienda/:tiendaId?',{
		controller : 'TiendaCtrl',
		templateUrl : TPL_PATH + '/tienda.html',
		title:'Tienda',
		slug:'tienda',
		//authorization: true
		authorization: false
    });
	$routeProvider.otherwise({redirectTo: '/'});
  }]);


/// Manejar URL y titulo
myApp.run(['$location', '$rootScope', 'jwtHelper', 'store', function($location, $rootScope, jwtHelper, store) {	
	$rootScope.$on('$routeChangeStart', function (event, current, next) {		
		$rootScope.autho = current.$$route.authorization;  
		var token = store.get("token") || null;
		//if($rootScope.autho == true) {			
			if(!token) {
				$rootScope.algo = false;
				if($rootScope.autho == true) {	
					$location.path("/login");		
				}
			} else {				
				$rootScope.algo = true;
				if($rootScope.autho == true) {	
				var bool = jwtHelper.isTokenExpired(token);
				if(bool === true) {
					$location.path("/login");
				}
				}
			}
		//}		
	});	
	$rootScope.$on('$routeChangeSuccess', function (event, current, previous, store) {
        $rootScope.title = current.$$route.title;        
		$rootScope.slug = current.$$route.slug;        
        $rootScope.activePath = $location.path();		
		

		//$rootScope.home_banner_footer = "http://superchinos.com.ar/nuevo/wp-content/uploads/2015/10/banner-cuido.png";
    });    
    
    //al cambiar de rutas
    $rootScope.$on('$routeChangeStart', function(event,current) {   
        var activo = $location.path()
        //auth.checkStatus(activo);
    })
}]);


// Autenticacion
myApp.factory("authFactory", ["$http", "$q", "CONFIG", function($http, $q, CONFIG)
{
	return {
		login: function(user)
		{
			var deferred;
            deferred = $q.defer();
            $http({
                method: 'POST',
                skipAuthorization: true,
                url: CONFIG.APIURL+'/login.php',
                data: "email=" + user.email + "&password=" + user.password,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(res)
            {
                deferred.resolve(res);
            })
            .then(function(error)
            {
                deferred.reject(error);
            })
            return deferred.promise;
		}
	}
}]);




myApp.controller('MainController', function($rootScope, $scope){
  $rootScope.$on('$routeChangeStart', function(){
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function(){
    $rootScope.loading = false;
  });
  /*
  $rootScope.buscar = function() {
	  alert("buscando");
  }
  */
});  


myApp.filter('nl2br', function() {
    var span = document.createElement('span');
    return function(input) {
        if (!input) return input;
        var lines = input.split('\n');

        for (var i = 0; i < lines.length; i++) {
            span.innerText = lines[i];
            span.textContent = lines[i];
            lines[i] = span.innerHTML;
        }
        return lines.join('<br />');
    }
});


function ocultaLocation() {	
	document.getElementById('locationWrap').style.display = 'none';
}
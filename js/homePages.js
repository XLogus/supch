'use strict';

angular.module('app.homePages', [])

  .factory('welcomeMessage', function() {
    return function() {
      return 'Welcome Home...';
    };
  })

  .controller('buscadorCtrl', function($scope, $rootScope) {	
	//$rootScope.busco = '';
	$scope.onbuscoChange = function(val){
		$rootScope.busco = val;		
	};
  })
  
  .controller('HomeCtrl', function($scope, $rootScope, $http, $location, welcomeMessage, jwtHelper, store, CONFIG) {	
	/*
	var token = store.get("token");	
	var tokenPayload = jwtHelper.decodeToken(token);
	$scope.user = tokenPayload.iss;	
	//alert($scope.user);
	*/
	
	
	var marker, map;
	$scope.$on('mapInitialized', function(evt, evtMap) { 
		map = evtMap; 
		marker = map.markers[0]; 
		$scope.geolat = -34.606395;
		$scope.geolong = -58.377314;
		map.setCenter({lat: $scope.geolat, lng: $scope.geolong});
		map.setZoom(13);		
		google.maps.event.trigger(map,'resize')
		//map.panTo([lat:-34.606395, lang:-58.377314]);
	});

	//alert(window.devicePixelRatio);
	
	
	$scope.pixelratio = window.devicePixelRatio;
	if($scope.pixelratio > 1.5){		
		$scope.basemarker = { 
			url: 'img/marker-yo@2x.png',
			size: [93, 93],
			scaledSize: [46, 46],
			origin: [0,0],
			anchor: [16, 37]
		};		
	} else {
		$scope.basemarker = 'img/marker-yo.png';	
	}
	
	$scope.show_super = function(event, cual) { 
		$location.path("/tienda/"+cual);
	}
	
	
	$scope.geolocalizar = function() {
		var onSuccess = function(position) {
			$scope.geolat = position.coords.latitude;
			$scope.geolong = position.coords.longitude;
			map.setCenter({lat: $scope.geolat, lng: $scope.geolong});
			map.setZoom(14);
			var latlng = new google.maps.LatLng($scope.geolat, $scope.geolong);
			map.markers.basepos.setPosition(latlng);
			
		};
		var onError = function(error) {
			 alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
		}
		//navigator.geolocation.getCurrentPosition(onSuccess);
		navigator.geolocation.getCurrentPosition(onSuccess, onError,{enableHighAccuracy: true, maximumAge: 75000, timeout: 30000});		
		
	};
	
	$rootScope.buscar = function() {
		//alert("ahi toy "+$rootScope.busco);
		//map.markers.basepos.setPosition($rootScope.busco);
		var posicion = "";
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { 'address': $rootScope.busco}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				posicion = results[0].geometry.location;
				map.setCenter(posicion);
				map.setZoom(14);
				map.markers.basepos.setPosition(posicion);
			}
		});
	};

	
	$http({
        method: "JSONP", 
        url: 'http://superchinos.com.ar/nuevo/json/chinos-vertodos.php?callback=JSON_CALLBACK',
        //headers: {'Content-Type': 'application/x-www-form-urlencoded'},     
		params: { 'pixelratio': $scope.pixelratio }, 		
        isArray: true}).
		success(function(data, status) {
			$scope.status = status;
			$scope.supers = data.items; 
			$scope.readyForMap = true;						
			//console.log('controller_partidos: '+$scope.locales);
			//console.log(JSON.stringify($scope.locales, null, 4));
			//console.log('controller_partidos: '+$scope.supers[0].icon);
		});    
  });

  
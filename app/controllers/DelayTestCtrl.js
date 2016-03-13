(function(){

	var app = angular.module("angular_starter");

	var DelayTestCtrl = function($scope, $http){
		
		$scope.loading = true;

		$http.jsonp("http://filltext.com/?rows=20&delay=2&fname={firstName}&callback=JSON_CALLBACK")
				.success(function(response){
					$scope.people = response;
					$scope.loading = false;
				});

	};

	app.controller("DelayTestCtrl", DelayTestCtrl);
	
}());
(function(){

	var app = angular.module("angular_starter");

	var FacebookCtrl = function($window, FacebookSvc){

		$window.fbAsyncInit = function() {
			FB.init({ 
				appId: '203693546336614',
				status: true, 
				cookie: true, 
				xfbml: true,
				version: 'v2.4'
			});
		};

		FacebookSvc.getMyLastName() .then(function(response) {
			$scope.last_name = response.last_name;
		});

	};

	app.controller("FacebookCtrl", FacebookCtrl);
	
}());
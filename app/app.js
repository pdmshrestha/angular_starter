(function(){

	console.log("## App Started ##");

	var app = angular.module("angular_starter", ["ngRoute"]);

	app.config(function($routeProvider){
		$routeProvider
		.when("/main" , {
			templateUrl: "templates/Main.html",
			controller: "MainCtrl"
		})
		.when("/user/:username", {
			templateUrl: "templates/User.html",
			controller: "UserCtrl"
		})
		.when("/delayTest", {
			templateUrl: "templates/DelayTest.html",
			controller: "DelayTestCtrl"
		})
		.otherwise({
			redirectTo: "/main"
		});

	});


}());
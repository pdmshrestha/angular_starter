(function(){

	console.log("## App Started ##");

	var app = angular.module("angular_starter", ["ngRoute", "ngFileUpload", "ngImgCrop"]);

	var httpHeaders; //the HTTP headers to be used by all requests
	
	//Constants
	var BASE_URL = "http://pdm-dev.com/cakephp_api/";
	app.constant("BaseUrl", BASE_URL);

	//Routes
	app.config(function($routeProvider){
		$routeProvider
		.when("/main" , {
			templateUrl: "templates/Main.html",
			controller: "MainCtrl"
		})
		.when("/login" , {
			templateUrl: "templates/Login.html",
			controller: "LoginCtrl"
		})
		.when("/account" , {
			templateUrl: "templates/Account.html",
			controller: "AccountCtrl"
		})
		.when("/users" , {
			templateUrl: "templates/Users.html",
			controller: "UsersCtrl"
		})
		.when("/user/:username", {
			templateUrl: "templates/User.html",
			controller: "UserCtrl"
		})
		.when("/delayTest", {
			templateUrl: "templates/DelayTest.html",
			controller: "DelayTestCtrl"
		})
		.when("/facebook", {
			templateUrl: "templates/Facebook.html",
			controller: "FacebookCtrl"
		})
		.otherwise({
			redirectTo: "/main"
		});
	});

	//http errors handling...
	app.factory('errorInterceptor', function ($q, $rootScope, $location) {
		return {
			request: function (config) {
				return config || $q.when(config);
			},
			requestError: function(request){
				return $q.reject(request);
			},
			response: function (response) {
				return response || $q.when(response);
			},
			responseError: function (response) {
				
				console.error(response);

				console.log(response.status);
				
				if (response && response.status === 404) {
				}
				if (response && response.status >= 500) {
				}
				
				return $q.reject(response);
			}
		};
	});

	app.config(function ($httpProvider) {
		$httpProvider.interceptors.push('errorInterceptor');
		httpHeaders = $httpProvider.defaults.headers;   
	});

	//Root Events
	app.run( function ($rootScope, $http, $location, Base64Svc){
		/**
        * Holds all the requests which failed due to 401 response.
        */
        $rootScope.requests401 = [];

        $rootScope.$on("event:loginConfirmed", function(){
        	$location.path("/users");
        });

        $rootScope.$on("event:loginRequest", function(event, username, password){
        	httpHeaders.common['Authorization'] = 'Basic ' + Base64Svc.encode(username + ':' + password);
        	$http.post(BASE_URL + "users/login.json").success(function (response) {
        		console.log(response);
        		$rootScope.$broadcast('event:loginConfirmed');
        	});
        });

        $rootScope.$on('event:loginRequired', function() {
        	console.log('fire event:loginRequired');
        	//  $('#login').modal('show');
        	$location.path('/login');
        });

        $rootScope.$on("event:logoutRequest", function(){
        	$http.post(BASE_URL + "users/logout.json").success(function (response) {
        		console.log(response);
        		httpHeaders.common['Authorization'] = null;
        		$rootScope.$emit('event:loginRequired');
        	});
        });

    });



}());
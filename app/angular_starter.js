'use strict';
/* Source: app/app.js */
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

/* Source: app/controllers/AccountCtrl.js */
(function(){

	var app = angular.module("angular_starter");

	var AccountCtrl = function($rootScope, $scope, $http, BaseUrl, Upload, $timeout){


		var getMe = function(){
			console.log("Get me");

			$http.get(BaseUrl + "users/me.json").success(function (response){
				console.log(response);
				//modify profile icon to full url
				response.me.profile_icon = BaseUrl + "img/profile/" + response.me.profile_icon;
				
				$scope.me = response.me;

				$scope.uploading = false;
			});

		};

		var uploadPic = function(dataUrl, name){

			$scope.uploading = true;

			var uploadSuccess = function (res){
				getMe();

				$scope.picFile = null;
			};

			var uploadError = function (err){
				console.log(err);
				$scope.uploading = false;
			};

			var data = {
				url: BaseUrl + "users/edit/" + $scope.me.id + ".json",
				data: { profile_icon: Upload.dataUrltoBlob(dataUrl, name) }
			}

			Upload.upload(data).then(uploadSuccess, uploadError);

		};

		$scope.uploadPic = uploadPic;
		getMe();

	};

	app.controller("AccountCtrl", AccountCtrl);

}());

/* Source: app/controllers/DelayTestCtrl.js */
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

/* Source: app/controllers/FacebookCtrl.js */
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

/* Source: app/controllers/LoginCtrl.js */
(function(){

	var app = angular.module("angular_starter");

	var LoginCtrl = function($scope){
		
		var login = function(){
			var email = $scope.email;
			var password = $scope.password;
			
			$scope.$emit('event:loginRequest', $scope.email, $scope.password);
		};
		
		$scope.login = login;
	};

	app.controller("LoginCtrl", LoginCtrl);
	
}());

/* Source: app/controllers/MainCtrl.js */
(function(){

	var app = angular.module("angular_starter");

	var MainCtrl = function($scope, $interval, $location){

		var decrementCountdown = function(){
			$scope.countdown -= 1;
			if($scope.countdown < 1){
				$scope.search($scope.username);
			}
		};

		var countdownInterval = null;
		var startCountdown = function(){
			countdownInterval = $interval(decrementCountdown, 1000, $scope.countdown);
		};

		$scope.search = function(username){
			if(countdownInterval){
				$interval.cancel(countdownInterval);
				$scope.countdown = null;
			}
			$location.path("/user/" + username);
		};

		$scope.username = "angular";
		$scope.countdown = 10;
		startCountdown();

	};

	app.controller("MainCtrl", MainCtrl);

}());

/* Source: app/controllers/UserCtrl.js */
(function(){

	var app = angular.module("angular_starter");

	var UserCtrl = function($scope, GithubSvc, $routeParams){

		var onUserComplete = function(response){
			$scope.user = response;
			GithubSvc.getRepos($scope.user).then(onRepos, onError);
		};

		var onRepos = function(response){
			$scope.repos = response;
		};

		var onError = function(reason){
			$scope.error = "Error on finding data.";
		};

		$scope.username = $routeParams.username;
		$scope.repoSortOrder = "-stargazers_count";
		GithubSvc.getUser($scope.username).then(onUserComplete, onError);

	};

	app.controller("UserCtrl", UserCtrl);

}());

/* Source: app/controllers/UsersCtrl.js */
(function(){

	var app = angular.module("angular_starter");

	var UsersCtrl = function($rootScope, $scope, $http, BaseUrl){
		
		var getUsers = function(){
			console.log("Get users");
			$http.get(BaseUrl + "users.json").success(function (response){
				console.log(response);
				$scope.users = response.users;
			});
		};

		var logout = function(){
			$rootScope.user = null;
            $scope.username = $scope.password = null;
			$scope.$emit('event:logoutRequest');
		};

		$scope.logout = logout;

		getUsers();
	};

	app.controller("UsersCtrl", UsersCtrl);
	
}());

/* Source: app/services/Base64Svc.js */
(function(){

	var Base64Svc = function(){
		
		var keyStr = "ABCDEFGHIJKLMNOP" +
			"QRSTUVWXYZabcdef" +
			"ghijklmnopqrstuv" +
			"wxyz0123456789+/" +
			"=";
		
		this.encode = function (input) {
			var output = "",
				chr1, chr2, chr3 = "",
				enc1, enc2, enc3, enc4 = "",
				i = 0;

			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output +
					keyStr.charAt(enc1) +
					keyStr.charAt(enc2) +
					keyStr.charAt(enc3) +
					keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			}

			return output;
		};

		this.decode = function (input) {
			var output = "",
				chr1, chr2, chr3 = "",
				enc1, enc2, enc3, enc4 = "",
				i = 0;

			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			while (i < input.length) {
				enc1 = keyStr.indexOf(input.charAt(i++));
				enc2 = keyStr.indexOf(input.charAt(i++));
				enc3 = keyStr.indexOf(input.charAt(i++));
				enc4 = keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			}
		};
	};

	var module = angular.module("angular_starter");
	
	module.service("Base64Svc", Base64Svc);

}());

/* Source: app/services/FacebookSvc.js */
(function(){

	var FacebookSvc = function($window, $http, $q){

		return {
			getMyLastName: function() {
				var deferred = $q.defer();
				FB.api('/me', {
					fields: 'last_name'
				}, function(response) {
					if (!response || response.error) {
						deferred.reject('Error occured');
					} else {
						deferred.resolve(response);
					}
				});
				return deferred.promise;
			}
		}
	};

	var module = angular.module("angular_starter");
	
	module.factory("FacebookSvc", FacebookSvc);

}());

/* Source: app/services/GithubSvc.js */
(function(){

	var GithubSvc = function($http){

		var getUser = function(username){
			return $http.get("https://api.github.com/users/" + username)
				.then(function(response){
					return response.data;
				});
		};

		var getRepos = function(user){
			return $http.get(user.repos_url)
				.then(function(response){
					return response.data;
				});
		};

		var getRepoDetails = function(username, reponame){
			var repo;
			var repoUrl = "https://api.github.com/repos/" + username + "/" + reponame;

			console.log(repoUrl);
			return $http.get(repoUrl)
						.then(function(response){
							repo = response.data;
							return $http.get(repoUrl + "/collaborators");
						})
						.then(function(response){
							repo.collaborators = response.data;
							return repo;
						});
		};
		
		return {
			getUser: getUser,
			getRepos: getRepos,
			getRepoDetails: getRepoDetails
		};
	};

	var module = angular.module("angular_starter");
	
	module.factory("GithubSvc", GithubSvc);

}());
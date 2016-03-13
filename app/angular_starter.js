'use strict';
/* Source: app/app.js */
(function(){

	console.log("## App Started ##");

	var app = angular.module("angular_starter", ["ngRoute"]);

	app.config(['$routeProvider', function($routeProvider){
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

	}]);


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
	DelayTestCtrl.$inject = ['$scope', '$http'];

	app.controller("DelayTestCtrl", DelayTestCtrl);
	
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
	MainCtrl.$inject = ['$scope', '$interval', '$location'];

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
	UserCtrl.$inject = ['$scope', 'GithubSvc', '$routeParams'];

	app.controller("UserCtrl", UserCtrl);

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
	GithubSvc.$inject = ['$http'];

	var module = angular.module("angular_starter");
	
	module.factory("GithubSvc", GithubSvc);

}());
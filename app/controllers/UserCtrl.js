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
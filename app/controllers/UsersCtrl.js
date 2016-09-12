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
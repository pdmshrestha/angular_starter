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
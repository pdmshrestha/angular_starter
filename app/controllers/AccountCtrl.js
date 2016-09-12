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
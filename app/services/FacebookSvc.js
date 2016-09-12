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
'use strict';

angular.module('debatable')
	.controller('MainCtrl', function($scope, $firebaseSimpleLogin, authClient) {
  		$scope.auth = authClient;

  		$scope.login = function() {
  			authClient.$login('github');
  		};

  		$scope.logout = function() {
  			authClient.$logout();
  		};
	});

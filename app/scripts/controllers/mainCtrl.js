'use strict';

angular.module('debatable')
	.controller('MainCtrl', ['$scope', '$rootScope', '$firebaseSimpleLogin', 'authClient', function($scope, $rootScope, $firebaseSimpleLogin, authClient) {
  		$rootScope.auth = authClient;

  		$scope.login = function() {
  			authClient.$login('github');
  		};

  		$scope.logout = function() {
  			authClient.$logout();
  		};
	}]
);

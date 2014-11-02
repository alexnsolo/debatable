'use strict';

angular.module('debatable')
	.controller('HomeCtrl', ['$scope', '$state', '$firebase', 'firebaseAddress', function($scope, $state, $firebase, firebaseAddress) {
		var debatesRef = $firebase(new Firebase(firebaseAddress + '/debates'));
  	  	$scope.debates = debatesRef.$asArray();

		$scope.newDebate = function() {
			$state.go('newDebate');
		};
	}]
);
'use strict';

angular.module('debatable')
	.factory('authClient', function($firebaseSimpleLogin, firebaseAddress) {
		var ref = new Firebase(firebaseAddress);
		return $firebaseSimpleLogin(ref);
	}
);
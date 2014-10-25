'use strict';

angular.module('debatable')
	.controller('NewDebateCtrl', 
	['$scope', 'firebaseAddress', '$state', 
	function ($scope, firebaseAddress, $state) {
		$scope.debate = {
			topic: '',
			maxTime: 15,
			maxJudges: 1,
			status: 'Open',
			participants: []
		};

		$scope.participationType = 'For';

		$scope.createDebate = function() {
			var debates = new Firebase(firebaseAddress + '/debates');
			var newDebate = $scope.debate;
			newDebate.participants.push({
				user: { 
					uid: $scope.auth.user.uid,
				 	displayName: $scope.auth.user.displayName 
				},
				type: $scope.participationType,
				creator: true
			});
			debates.push(newDebate);
			$state.go('home');
		};
	}]);
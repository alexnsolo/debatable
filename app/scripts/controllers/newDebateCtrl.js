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
			var debatesRef = new Firebase(firebaseAddress + '/debates');
			var newDebate = $scope.debate;
			var newDebateRef = debatesRef.push(newDebate);

			var participantsRef = new Firebase(firebaseAddress + '/debates/' + newDebateRef.name() + '/participants');
			participantsRef.push({
				user: { 
					uid: $scope.auth.user.uid,
				 	displayName: $scope.auth.user.displayName 
				},
				type: $scope.participationType,
				creator: true
			});

			$state.go('home');
		};
	}]);
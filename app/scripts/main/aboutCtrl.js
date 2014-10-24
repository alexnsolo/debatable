'use strict';

angular.module('debatable')
  .controller('AboutCtrl', function ($scope, frameworks) {
    $scope.frameworks = frameworks;
  });

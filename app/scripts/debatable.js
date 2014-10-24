'use strict';

angular.module('debatable', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute', 'firebase'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'partials/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/home'
      });
  })
;

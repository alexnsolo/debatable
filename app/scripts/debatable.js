'use strict';

angular.module('debatable', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute', 'firebase'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
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

'use strict';

angular.module('debatable', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'firebase', 'ui.bootstrap'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'partials/home.html'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'partials/about.html'
      })
      .state('newDebate', {
        url: '/newDebate',
        templateUrl: 'partials/newDebate.html'
      });
  });

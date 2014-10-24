'use strict';

describe('controllers', function(){
  var scope;

  beforeEach(module('debatable'));

  beforeEach(inject(function($rootScope) {
  	scope = $rootScope.$new();
  }));
});

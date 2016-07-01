'use strict'

// Declare app level module which depends on views, and components
angular.module('addressBook', [
  'ngRoute',
  'addressBook.contacts'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.otherwise({redirectTo: '/contacts'});
}])

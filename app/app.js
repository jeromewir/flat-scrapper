angular.module('flat-scrapper', [
  'angularMoment',
  'ui.router',
]).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('flat', {
      url: '/flat',
      templateUrl: 'list/list.html',
      controller: 'flatListCtrl',
    })
    .state('flatShow', {
      url: '/flat/:flatId',
      templateUrl: 'show/show.html',
      controller: 'flatShowCtrl',
    });
  $urlRouterProvider.otherwise('/flat');
});

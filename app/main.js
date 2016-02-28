'use strict'

angular.module('flat-scrapper', ['angularMoment']).controller('mainCtrl', function($scope, $http, $window, $timeout, moment) {
  $scope.moment = moment;
  $scope.addFlat = function() {
    var url = $scope.flatUrl;

    $http.post('/api/flat', { url: url }).then(function(res) {
      $scope.flats.push(res.data.flat);
      $scope.flatUrl = '';
    }, function(err) {
      $scope.err = err.data.message;
      $timeout(function() {
        $scope.err = null;
      }, 3000);
    });
  };

  $scope.openTab = function(url) {
    $window.open(url);
  };

  $scope.getLabel = function(flat) {
    var style = {
      'Se Loger': 'background-color: #1abc9c',
      'Le bon coin': 'background-color: #f1c40f',
      'Logic-Immo': 'background-color: #3498db',
      PAP: 'background-color: #e67e22',
    };
    return style[flat.website];
  };

  $http.get('/api/flat').then(function(res) {
    $scope.flats = res.data.flats;
    console.log($scope.flats.length);
  }, function(err) {
    console.error(err);
  });
});
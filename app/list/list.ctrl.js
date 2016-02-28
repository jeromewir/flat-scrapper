'use strict';

angular.module('flat-scrapper').controller('flatListCtrl', function($scope, $http, $window, $timeout, moment) {
  $scope.moment = moment;

  $scope.sort = [
    { name: 'Nom', field: 'name', icon: 'newspaper' },
    { name: 'Prix', field: 'price', icon: 'dollar' },
    { name: 'Date', field: 'createdAt', icon: 'clock' },
    { name: 'Taille', field: 'size', icon: 'marker' },
    { name: 'Pièces', field: 'rooms', icon: 'square outline' },
    { name: 'Visité', field: 'visited', icon: 'eye' },
  ];

  $scope.curSort = $scope.sort[2];

  $scope.setSort = function(sort) {
    if (sort.field == $scope.curSort.field) {
      $scope.curSort.reverse = !$scope.curSort.reverse;
    } else {
      $scope.curSort = sort;
    }
  };

  $scope.addFlat = function() {
    var url = $scope.flatUrl;
    $scope.isAdding = true;

    $http.post('/api/flat', { url: url }).then(function(res) {
      $scope.flats.push(res.data.flat);
      $scope.flatUrl = '';
      $scope.isAdding = false;
    }, function(err) {
      $scope.err = err.data.message;
      $scope.isAdding = false;
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
  }, function(err) {
    console.error(err);
  });
});
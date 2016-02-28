angular.module('flat-scrapper').controller('flatShowCtrl', function($scope, $stateParams, $http, $timeout, $state) {
  $http.get('/api/flat/' + $stateParams.flatId)
    .then(function(res) {
      $scope.flat = res.data.flat;
      $timeout(function() {
        $('#carousel').owlCarousel({
          navigation: true, // Show next and prev buttons
          slideSpeed: 300,
          paginationSpeed: 400,
          singleItem:true
        });
      });
    }, function(err) {
      console.error(err.data);
    });

  $scope.saveFlat = function() {
    $scope.isSaving = true;
    $http.post('/api/flat/' + $scope.flat._id, { flat: $scope.flat })
      .then(function(res) {
        $scope.isSaving = false;
        $scope.saveSuccess = true;
        $timeout(function() {
          $scope.saveSuccess = false;
        }, 3000);
      }, function(err) {
        $scope.isSaving = false;
        console.error(err);
      });
  }

  $scope.deleteFlat = function(event) {
    event.preventDefault();
    $http.delete('/api/flat/' + $scope.flat._id)
      .then(function(res) {
        $state.go('flat');
      }, function(err) {
        console.error(err.data.message);
      });
  };
});
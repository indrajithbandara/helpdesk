
angApp.controller('releaseCtrl', function($scope, $window, $http) {
    //
    $scope.semester = Lockr.get('settings').semester;
    /*
    if($scope.requests == undefined || $scope.requests.length == 0){
        $('#no_requests').modal('show');
        $window.location.href = '#!/main';
    }
    */
    //
});

angApp.controller('intakeCtrl', function($scope, $window, $http) {
	$scope.semester = Lockr.get('settings').semester;

});

angApp.controller('onlyCtrl', function($scope, $window, $http) {
    //
    $scope.semester = Lockr.get('settings').semester;
    
    //
});

angApp.controller('requestCtrl', function($scope, $window, $http) {
	//
    $scope.semester = Lockr.get('settings').semester;
    $scope.requests = Lockr.get('requests');

    if($scope.requests == undefined || $scope.requests.length == 0){
        $('#no_requests').modal('show');
        $window.location.href = '#!/main';
    }
    //
});
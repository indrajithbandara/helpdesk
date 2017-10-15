
angApp.controller('releaseCtrl', function($scope, $window) {
    //
    $scope.$on('$viewContentLoaded', function() {
		if($scope.requests == undefined || $scope.requests.length == 0){
			$('#no_requests').modal('show');
			$window.location.href = '#!/main';
    	}
    });
    //
});

angApp.controller('intakeCtrl', function($scope, $window) {
	
});

angApp.controller('onlyCtrl', function($scope, $window) {
    //
    
    //
});

angApp.controller('requestCtrl', function($scope, $window) {
	
});
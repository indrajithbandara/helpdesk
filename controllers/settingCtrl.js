
angApp.controller('settingsCtrl', function($scope, $window) {
	
	$scope.settings = Lockr.get('settings');
	$scope.semester = Lockr.get('settings').semester;
	
	$scope.save = function(){
		loadingEffect();
		
		Lockr.set('settings', $scope.settings);
		baseMessage('Settings updated successfully!', 'success', 1000, refresh);
	}

	$scope.actionReset = function(){
        checkAuthority("This action will erase all data from the Help Desk Application. Are you sure you want to continue?", function(){$scope.reset()});
    }

	$scope.reset = function(){
        resetDB();
    };
});
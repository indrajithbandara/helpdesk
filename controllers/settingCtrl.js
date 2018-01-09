
angApp.controller('settingsCtrl', function($scope, $window) {
	
	$scope.settings = Lockr.get('settings');

	$scope.semester = Lockr.get('settings').semester;
	
	$scope.save = function(){
		Lockr.set('settings', $scope.settings);
		//
		new Noty({
            text: 'Settings updated successfully!',
            type: 'success',
            timeout: 1000,
        }).show();  
	}

	$scope.reset = function(){
        resetDB();
    };
});
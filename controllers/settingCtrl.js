
angApp.controller('settingsCtrl', function($scope, $window) {
	$scope.semester = Lockr.get('settings').semester;
	$scope.settings = Lockr.get('settings');
	//
	$scope.save = function(x){
		Lockr.set('settings', x);
		changeSettings();
		//
		new Noty({
            text: 'Settings updated successfully!',
            type: 'success',
            timeout: 1000,
        }).show();  
	}
});
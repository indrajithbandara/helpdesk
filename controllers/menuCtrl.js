angApp.controller('menuCtrl', function($scope, $window, requestUtils) {
    $scope.username = Lockr.get('session').username;
    
    $scope.about = function(){
        $('#about').modal('show');
    };

    $scope.logout = function(){
        Lockr.set('session', {});
		window.location.href = '../index.html';
	};

    $scope.reset = function(){
        resetDB();
        //Lockr.set('session', {});
        //window.location.href = '../index.html';
    };

    $scope.refreshRequests = function(){
        requestUtils.checkRequests();
    }

    $scope.refreshRequesters = function(){
        requestUtils.checkTechnicians();
    }
});
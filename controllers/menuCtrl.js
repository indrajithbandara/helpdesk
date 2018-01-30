angApp.controller('menuCtrl', function($scope, $window, requestUtils) {
    //$scope.username = Lockr.get('session').username;
    $scope.session  = Lockr.get('session');

    $scope.about = function(){
        $('#about').modal('show');
    };

    $scope.logout = function(){
        Lockr.set('session', {});
		window.location.href = '../index.html';
	};

    $scope.refreshRequests = function(){
        requestUtils.checkOpenRequests();
    }

    $scope.refreshRequesters = function(){
        requestUtils.checkTechnicians();
    }
});
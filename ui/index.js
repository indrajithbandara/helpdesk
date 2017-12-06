const angApp = angular.module('angApp', ['ngRoute']);

// configure our routes
angApp.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'main.html',
	})
	.when('/user', {
		templateUrl : 'user.html',
	})
	.when('/add_user', {
		templateUrl: 'user_form.html',
	})
	.when('/edit_user/:id', {
		templateUrl: 'user_form.html',
	})
	.when('/request', {
		templateUrl : 'request.html',
	})
	.when('/release', {
		templateUrl : 'request_release.html',
	})
	.when('/intake', {
		templateUrl : 'request_intake.html',
	})
	.when('/customer', {
		templateUrl : 'customer.html',
	})
	.when('/add_customer', {
		templateUrl: 'customer_form.html',
	})
	.when('/edit_customer/:id', {
		templateUrl: 'customer_form.html',
	})
	.when('/settings', {
		templateUrl : 'settings.html',
	})
	.when('/only', {
		templateUrl : 'request_only.html',
	})
	.otherwise({redirectTo:'/'});
});

angApp.filter('capitalize', function() {
    return function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
});

angApp.controller('menuCtrl', function($scope, $window, $http) {
	//
	$scope.logout = function(){
		Lockr.set('session', {});
		window.location.href = '../index.html';
	};
	
	$scope.feedback = function(){
		$('#feedback').modal("setting", {
            onHide: function () {
                $scope.message = "";
            }
        }).modal('show');
	};

	$scope.sendFeedback = function(){
		alert($scope.message);
	}
	
	$scope.about = function(){
		$('#about').modal('show');
	};
	//
});

angApp.controller('mainCtrl', function($scope, $window) {
	//
	$scope.semester = Lockr.get('settings').semester;
	checkTechnicians();
	checkRequests();	
	//
});

/*
	$scope.$on('$viewContentLoaded', function() {
		
		//Colocar Load bar
		checkTechnicians();
		checkRequests();

		
		
		$scope.satisfactionLevel = SATISFACTION;
		$scope.satisfaction = $scope.satisfactionLevel[1].value;
		$scope.categories = CATS;
		$scope.category = $scope.categories[0].value;
		$scope.colorOptions = COLORS;
		$scope.colorDevice = $scope.colorOptions[0].value;
		$scope.osOptions = OS;
		$scope.operatingSystem = $scope.osOptions[7].value;
		
		//Check customers:
		$scope.technicians = localStorage.technicians;
		$scope.requests = localStorage.requests;

		

		booleanCheck = ($scope.technicians != undefined && $scope.technicians.length > 0);
		$scope.technician = booleanCheck ? $scope.technicians[0] : {};
		//Check Requests:
		booleanCheck = ($scope.requests != undefined && $scope.requests.length > 0);
		$scope.request = booleanCheck ? $scope.requests[0] : {};
		
	});
	*/
	
	/*

	$scope.saveEntity = function(x, entity){
		Lockr.sadd(entity, x);
		//
		new Noty({
            text: entity + ' saved successfully!',
			type: 'success',
			timeout: 3000,
		}).on('onClose', function() {
			$scope.back();
		}).show();
	};

	$scope.editEntity = function(id, x, entity){
		updateSQL(entity, id, x);
		//
		new Noty({
            text: entity + ' updated successfully!',
			type: 'success',
			timeout: 3000,
		}).on('onClose', function() {
			$scope.back();
		}).show();
	};

	$scope.deleteEntity = function(id, entity){
		deleteSQL(entity, id);
		//
		new Noty({
            text: entity + ' deleted successfully!',
			type: 'success',
			timeout: 3000,
		}).on('onClose', function() {
			//$scope.back();
			location.reload();
		}).show();
	};

	$scope.viewEntity = function(id){

	};

	//Helpers:
	$scope.isLogged = localStorage.session != {};
	$scope.isOnline = navigator.onLine;
	*/

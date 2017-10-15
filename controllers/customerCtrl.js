angApp.controller('customerCtrl', function($scope, $window, $routeParams) {
    $('#phoneNumber').mask('(000)000-0000');
	$('#studentNumber').mask('000000000');
    $scope.regexStudent = '[0-9]{9}';
    $scope.regexFaculty = '[N][\/][A]';
    //;
    $scope.customer = {
        studentType: 'student'
    };
    //
    if($routeParams.id != undefined){
        console.log("marjorie estiano");
        $scope.customer = Lockr.get('customers')[$routeParams.id];
    }
    //delete TODO..
    $scope.delete = function(id){
        $scope.deleteEntity(id, 'customers');
    };

    $scope.save = function(customer){
        if($routeParams.id != undefined)
            $scope.editEntity($routeParams.id, customer, 'customers');
        else
            $scope.saveEntity(customer, 'customers');
    };
});
angApp.controller('customerCtrl', function($scope, $window) {
    $scope.customers = [];
    $scope.semester = Lockr.get('settings').semester;
    $scope.session = Lockr.get('session');

    transactionSQL('SELECT * FROM customers', [], function(results){
        if(results.rows.length > 0){                
            $scope.customers = [];

            for (var i = 0; i < results.rows.length; i++) {
                $scope.customers.push(results.rows[i]);
            }
            
            $scope.$apply();
        }
    });

    //delete TODO..
    $scope.delete = function(id){
        let SQL = "DELETE FROM customers WHERE id = ?";
        transactionSQL(SQL, [id], function(results){
            new Noty({
                text: 'Customer deleted successfully!',
                type: 'success',
                timeout: 1000,
                callbacks: CALLBACK_GO_BACK,
            }).show();   
        });
    }; 
});

angApp.controller('customerFormCtrl', function($scope, $window, $routeParams) {
    $('#phone').mask('(000)000-0000');
	$('#studentNumber').mask('000000000');

    $scope.regexStudent = '[0-9]{9}';
    $scope.regexFaculty = '[N][\/][A]';
    $scope.semester = Lockr.get('settings').semester;
    $scope.studentNumbers = []
    $scope.emails = []

    transactionSQL('SELECT * FROM customers', [], function(results){
        if(results.rows.length > 0){                
            $scope.customers = [];
            for (var i = 0; i < results.rows.length; i++) {
                $scope.customers.push(results.rows[i]);
            }

            if($routeParams.id != undefined){
                $scope.customer = $scope.customers.filter(student => student.id == $routeParams.id)[0];
            }

            $scope.studentNumbers = $scope.customers.filter(student => student.studentNumber != "N/A" && student.id != $routeParams.id).map(student => student.studentNumber);
            $scope.emails = $scope.customers.filter(student => student.id != $routeParams.id).map(student => student.email);
            console.log($scope.studentNumbers);
            console.log($scope.emails);

            $scope.$apply();
        }
    });

    $scope.save = function(){
        let SQL = "INSERT INTO customers (name, type, studentNumber, phone, email) VALUES (?,?,?,?,?)";
        if($routeParams.id != undefined){
            SQL = "UPDATE customers SET name = ?, type = ?, studentNumber = ?, phone = ?, email = ? WHERE id = " + $routeParams.id;
        }

        transactionSQL(SQL, 
            [$scope.customer.name, $scope.customer.type, $scope.customer.studentNumber, $scope.customer.phone, $scope.customer.email], 
            function(results){
                new Noty({
                    text: 'Customer data saved successfully!',
                    type: 'success',
                    timeout: 1000,
                }).on('onClose', function() {
                    goBack();
                }).show(); 
        });
    };

    $scope.isSameNumber = function(studentNumber){
        return $scope.studentNumbers.includes(studentNumber);
    }

    $scope.isSameEmail = function(email){
        return $scope.emails.includes(email);
    }
});
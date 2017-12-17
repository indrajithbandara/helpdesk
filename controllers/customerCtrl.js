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
            baseMessage('Customer deleted successfully!', 'success', 1000, goBack);
        });
    }; 
});

angApp.controller('customerFormCtrl', function($scope, $window, $routeParams) {
    $('#phone').mask('(000)000-0000');
    $scope.customer = {}
    $scope.customer.type = "Student";
    $scope.semester = Lockr.get('settings').semester;
    
    $scope.fetch = function(){
        transactionSQL('SELECT * FROM customers', [], function(results){
            if(results.rows.length > 0){                
                $scope.customers = [];
                
                for (var i = 0; i < results.rows.length; i++) {
                    $scope.customers.push(results.rows[i]);
                }

                if($routeParams.id != undefined){
                    $scope.customer = $scope.customers.filter(student => student.id == $routeParams.id)[0];
                }

                $scope.$apply();
            }
        });
    };

    $scope.fetch();
    
    $scope.save = function(){
        let SQL = "INSERT INTO customers (name, type, phone, email) VALUES (?,?,?,?)";

        if($routeParams.id != undefined){
            SQL = "UPDATE customers SET name = ?, type = ?, phone = ?, email = ? WHERE id = " + $routeParams.id;
        }

        transactionSQL(SQL, 
            [$scope.customer.name, $scope.customer.type, $scope.customer.phone, $scope.customer.email], 
            function(results){
                baseMessage('Customer data saved successfully!', 'success', 1000, goBack);
        });
    };
});
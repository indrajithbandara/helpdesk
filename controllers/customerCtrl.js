angApp.controller('customerCtrl', function($scope, $window) {
    $scope.customers = [];
    $scope.semester = Lockr.get('settings').semester;
    $scope.session = Lockr.get('session');
    $scope.selected = [];

    transactionSQL('SELECT * FROM customers', [], function(results){
        if(results.rows.length > 0){                
            $scope.customers = [];

            for (var i = 0; i < results.rows.length; i++) {
                $scope.customers.push(results.rows[i]);
            }
            
            $scope.$apply();
        }
    });

    $scope.actionDelete = function(id){
        checkAuthority("Are you sure that you want to delete this customer?", function(){$scope.delete(id)});
    }

    $scope.actionDeleteAll = function(){
        checkAuthority("Are you sure that you want to delete all customers?", function(){$scope.deleteAll()});
    }

    $scope.actionDeleteSelected = function(){
        checkAuthority("Are you sure that you want to delete the selected customers?", function(){$scope.deleteSelected()});
    }

    $scope.select = function(id){
        if($scope.selected.indexOf(id) == -1){
            $scope.selected.push(id);
        }else{
            $scope.selected =  $scope.selected.filter(e => e !== id);
        }

        console.log($scope.selected);
    }

    //delete TODO..
    $scope.delete = function(id){
        let SQL = "DELETE FROM customers WHERE id = ?";
        
        transactionSQL(SQL, [id], function(results){
            baseMessage('Customer deleted successfully!', 'success', 1000, refresh);
        });
    }; 

    $scope.deleteAll = function(){
        let SQL = "DELETE FROM customers";
        
        transactionSQL(SQL, [], function(results){
            baseMessage('Customers deleted successfully!', 'success', 1000, refresh);
        });
    }

    $scope.deleteSelected = function(){
        let SQL = "DELETE FROM customers WHERE ";

        var str_query = "";
        var size = $scope.selected.length;

        for (var i = 0; i < size; i++) {
            if(i == size - 1){
                str_query += "id = " + $scope.selected[i];
            }else{
                str_query += "id = " + $scope.selected[i] + " OR ";
            }
        }

        SQL += str_query;

        ///alert(SQL);

        transactionSQL(SQL, [], function(results){
            baseMessage('Customers deleted successfully!', 'success', 1000, refresh);
        });
    }
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
            [$scope.customer.name, $scope.customer.type, getCleaned($scope.customer.phone), getCleaned($scope.customer.email)], 
            function(results){
                baseMessage('Customer data saved successfully!', 'success', 1000, goBack);
        });
    };
});
angApp.controller('userCtrl', function($scope, $window){
	$scope.users = [];
	$scope.semester = Lockr.get('settings').semester;
    $scope.session = Lockr.get('session');

	transactionSQL('SELECT * FROM users', [], function(results){
        if(results.rows.length > 0){                
            $scope.users = [];

            for (var i = 0; i < results.rows.length; i++) {
                $scope.users.push(results.rows[i]);
            }
            
            $scope.$apply();
        }
    });

    //delete TODO..
    $scope.delete = function(id){
        let SQL = "DELETE FROM users WHERE id = ?";

        transactionSQL(SQL, [id], function(results){
            //
            new Noty({
                text: 'User deleted successfully!',
                type: 'success',
                timeout: 1000,
            }).show();   
        });
    };
});

angApp.controller('userFormCtrl', function($scope, $window, $routeParams){
    //
    $scope.semester = Lockr.get('settings').semester;

    transactionSQL('SELECT * FROM users', [], function(results){
        if(results.rows.length > 0){                
            $scope.users = [];

            for (var i = 0; i < results.rows.length; i++) {
                $scope.users.push(results.rows[i]);
            }

            if($routeParams.id != undefined){
                $scope.user = $scope.users.filter(user => user.id == $routeParams.id)[0];
            }
            
            $scope.$apply();
        }
    });
    
    $scope.save = function(){
        console.log($scope.user);
        //
        let SQL = "INSERT INTO users (username, role, password, code) VALUES (?,?,?,?)";
        if($routeParams.id != undefined){
            SQL = "UPDATE users SET username = ?, role = ?, password = ?, code = ? WHERE id = " + $routeParams.id;
        }

        transactionSQL(SQL, 
            [$scope.user.username, $scope.user.role, md5($scope.user.password), $scope.user.password], 
            function(results){
                //
                new Noty({
                    text: 'User data saved successfully!',
                    type: 'success',
                    timeout: 1000,
                }).show();   
        });
    };
});
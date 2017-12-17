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
        let SQL = "DELETE FROM users WHERE id = ? AND username != 'admin'";

        transactionSQL(SQL, [id], function(results){
            //
            new Noty({
                text: 'User deleted successfully!',
                type: 'success',
                timeout: 1000,
                callbacks: CALLBACK_GO_BACK,
            }).show();   
        });
    };
});

angApp.controller('userFormCtrl', function($scope, $window, $routeParams){
    //
    $scope.semester = Lockr.get('settings').semester;
    $scope.session = Lockr.get('session');
    $scope.usernames = []
    $scope.oldName = '';
    
    transactionSQL('SELECT * FROM users', [], function(results){
        if(results.rows.length > 0){                
            $scope.users = [];

            for (var i = 0; i < results.rows.length; i++) {
                $scope.users.push(results.rows[i]);
            }

            if($routeParams.id != undefined){
                $scope.user = $scope.users.filter(user => user.id == $routeParams.id)[0];
                $scope.user.password = $scope.user.confirm_password = $scope.user.code;

                $scope.oldName = $scope.users.filter(user => user.id == $routeParams.id)[0].username;
            }

            $scope.usernames = $scope.users.filter(user => user.id != $routeParams.id).map(user => user.username);
            console.log($scope.usernames);
            
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
                    callbacks: CALLBACK_GO_BACK,
                }).show();   
        });
    };

    $scope.isSameUsername = function(username){
        return $scope.usernames.includes(username);
    }

    $scope.areDiferent = function(password, confirmation){
        return password !== confirmation;
    }    
});
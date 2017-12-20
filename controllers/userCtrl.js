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
            baseMessage('User data deleted successfully!', 'success', 2000, refresh);
        });
    };
});

angApp.controller('userFormCtrl', function($scope, $window, $routeParams){
    $scope.semester = Lockr.get('settings').semester;
    $scope.session = Lockr.get('session');
    $scope.usernames = []
    $scope.oldName = '';
    $scope.user = {};
    $scope.user.role = "user";
    $scope.technicians = Lockr.get('technicians');    
    
    if($scope.technicians.length > 0){
        if($scope.user)
            $scope.user.technician = $scope.technicians[0];
    }
    
    //console.log($scope.technicians); 
    transactionSQL('SELECT * FROM users', [], function(results){
        if(results.rows.length > 0){                
            $scope.users = [];

            for (var i = 0; i < results.rows.length; i++) {
                $scope.users.push(results.rows[i]);
            }

            console.log($scope.users);

            if($routeParams.id != undefined){
                console.log($routeParams.id);
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
        let SQL = "INSERT INTO users (username, technician, role, password, code) VALUES (?,?,?,?,?)";
        if($routeParams.id != undefined){
            SQL = "UPDATE users SET username = ?, technician = ?, role = ?, password = ?, code = ? WHERE id = " + $routeParams.id;    
            //
            if($routeParams.id == Lockr.get('session').id){
                //
                Lockr.set('session', $scope.user);
            }
        }
        
        console.log($scope.user.technician);

        transactionSQL(SQL, 
            [$scope.user.username, $scope.user.technician, $scope.user.role, md5($scope.user.password), $scope.user.password], 
            function(results){
                baseMessage('User data saved successfully!', 'success', 2000, goBack);
        });
    };

    $scope.isSameUsername = function(username){
        return $scope.usernames.includes(username);
    }

    $scope.areDiferent = function(password, confirmation){
        return password !== confirmation;
    }    
});
angApp.controller('userCtrl', function($scope, $window){
	$scope.users = [];
	$scope.semester = Lockr.get('settings').semester;
    $scope.session = Lockr.get('session');
    $scope.selected = [];

	transactionSQL('SELECT * FROM users', [], function(results){
        if(results.rows.length > 0){                
            $scope.users = [];

            for (var i = 0; i < results.rows.length; i++) {
                $scope.users.push(results.rows[i]);
            }
            
            $scope.$apply();
        }
    });

    $scope.select = function(id){
        if($scope.selected.indexOf(id) == -1){
            $scope.selected.push(id);
        }else{
            $scope.selected =  $scope.selected.filter(e => e !== id);
        }

        console.log($scope.selected);
    }

    $scope.actionDelete = function(id){
        checkAuthority("Are you sure that you want to delete this user?", function(){$scope.delete(id)});
    }

    $scope.actionDeleteAll = function(){
        checkAuthority("Are you sure that you want to delete all users?", function(){$scope.deleteAll()});
    }

    $scope.actionDeleteSelected = function(){
        checkAuthority("Are you sure that you want to delete the selected users?", function(){$scope.deleteSelected()});
    }


    //delete TODO..
    $scope.delete = function(id){
        var currentID = Lockr.get('session')['id'];
        let SQL = "DELETE FROM users WHERE id = ? AND (username != 'admin' AND id != ?)";

        transactionSQL(SQL, [id, currentID], function(results){
            baseMessage('User data deleted successfully!', 'success', 2000, refresh);
        });
    };

    $scope.deleteAll = function(){
        var currentID = Lockr.get('session')['id'];
        let SQL = "DELETE FROM users WHERE (username != 'admin' AND id != ?)";
        
        transactionSQL(SQL, [currentID], function(results){
            baseMessage('Users deleted successfully!', 'success', 1000, refresh);
        });
    }

    $scope.deleteSelected = function(){
        var currentID = Lockr.get('session')['id'];
        let SQL = "DELETE FROM users WHERE (username != 'admin' AND id != ?) AND ( ";
        
        var str_query = "";
        var size = $scope.selected.length;

        for (var i = 0; i < size; i++) {
            if(i == size - 1){
                str_query += "id = " + $scope.selected[i] + ")";
            }else{
                str_query += "id = " + $scope.selected[i] + " OR ";
            }
        }

        SQL += str_query;

        alert(SQL);

        transactionSQL(SQL, [currentID], function(results){
            baseMessage('Users deleted successfully!', 'success', 1000, refresh);
        });
    }
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
        }
        
        console.log($scope.user.technician);

        transactionSQL(SQL, 
            [$scope.user.username, $scope.user.technician, $scope.user.role, md5($scope.user.password), $scope.user.password], 
            function(results){
                if($routeParams.id == Lockr.get('session').id){
                    //
                    $scope.user.password = md5($scope.user.password);
                    Lockr.set('session', $scope.user);
                }
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
let loginApp = angular.module('app', []);

loginApp.controller('loginCtrl', function($scope, $window) {
    document.getElementById("username").focus();
    
    $scope.tryLogin = function() {
        transactionSQL('SELECT * FROM users WHERE LOWER(username) = ? AND password = ?', [$scope.user.username.toLowerCase(), md5($scope.user.password)], 
            function(results){
                if(results.rows.length > 0){
                    Lockr.set('session', results.rows[0]);
                    $window.location.href = 'ui/default.html';
                }else{
                    spop({
                        template: 'Wrong username or password!',
                        style: 'error',
                        autoclose: 3000,
                        onClose: function() {
                            document.getElementById("username").focus();
                        }
                    });
                }
        });
    };
});
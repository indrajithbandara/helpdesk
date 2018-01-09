// create the module and name it angApp
let loginApp = angular.module('app', []);

loginApp.controller('loginCtrl', function($scope, $window) {
    
    $scope.tryLogin = function() {
        transactionSQL('SELECT * FROM users WHERE LOWER(username) = ? AND password = ?', [$scope.user.username.toLowerCase(), md5($scope.user.password)], 
            function(results){
                if(results.rows.length > 0){
                    Lockr.set('session', results.rows[0]);
                    $window.location.href = 'ui/default.html';
                }else{
                    new Noty({
                        text: 'Wrong username or password!',
                        type: 'error',
                        timeout: 3000,
                        callbacks: {
                            onClose: function() {
                                $("#username").focus();
                            }
                        },
                    }).show();
                }
        });
    };

    //
    
});
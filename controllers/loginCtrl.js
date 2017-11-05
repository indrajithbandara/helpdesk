// create the module and name it angApp
let loginApp = angular.module('app', []);

loginApp.controller('loginCtrl', function($scope, $window) {
    //
    $scope.openRecoverPassword = function(){
        $('#recover_email').modal("setting", {
            onHide: function () {
                $scope.username = "";
            }
        }).modal('show');    
    };

    $scope.sendPassword = function(){
        transactionSQL('SELECT username, code FROM users WHERE username = ?', [$scope.username], function(results){
            if(results.rows.length > 0){
                let selected = results.rows[0];
                const bodyMessage = PRINTJ.sprintf("Hello %s. Your password is %s", selected.username, selected.code);
                console.log(bodyMessage);
                //SEND E-mail Here:
                //sendEmail(users[i].email, "Password recovery", bodyMessage);
            }else{
                new Noty({
                    text: 'Username not found!',
                    type: 'error',
                    timeout: 3000,
                }).show();    
            }
        });
    };

    $scope.tryLogin = function() {
        transactionSQL('SELECT * FROM users WHERE username = ? AND password = ?', [$scope.user.username, md5($scope.user.password)], 
            function(results){
                if(results.rows.length > 0){
                    localStorage.session = results.rows[0];
                    $window.location.href = 'ui/default.html';        
                }else{
                    new Noty({
                        text: 'Wrong username or password',
                        type: 'error',
                    }).show();
                    $("#username").focus();
                }
        });
    };
});
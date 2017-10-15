// create the module and name it angApp
const loginApp = angular.module('app', []);

loginApp.controller('loginCtrl', function($scope, $window) {
    //
    $scope.recoverPassword = function(email){
        //Send e-mail:
        //Get a callback:
        alert("HEHE");
    };

    $scope.tryLogin = function(user) {
        const users = Lockr.get('users');
        var isOk = false;
        for(var i = 0; i < users.length; i++)
            if(users[i].username == user.username 
            && users[i].password == md5(user.password)){
                user = users[i];
                isOk = true;
            }
        
        if(isOk != false) {
            Lockr.set('session', user);  
            $window.location.href = 'ui/default.html';
        }else{
            new Noty({
                text: 'Wrong username or password',
                type: 'error',
            }).show();
            $("#username").focus();
        }
    };
});
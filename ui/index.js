const angApp = angular.module('angApp', ['ngRoute']);
let rp = require('request-promise');
const OPERATIONS = ["ADD_REQUEST", "EDIT_REQUEST", "CLOSE_REQUEST", "GET_REQUESTS", "GET_ALL"];
// configure our routes
angApp.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'main.html',
	})
	.when('/user', {
		templateUrl : 'user.html',
	})
	.when('/add_user', {
		templateUrl: 'user_form.html',
	})
	.when('/edit_user/:id', {
		templateUrl: 'user_form.html',
	})
	.when('/request', {
		templateUrl : 'request.html',
	})
	.when('/release', {
		templateUrl : 'request_release.html',
	})
	.when('/intake', {
		templateUrl : 'request_intake.html',
	})
	.when('/customer', {
		templateUrl : 'customer.html',
	})
	.when('/add_customer', {
		templateUrl: 'customer_form.html',
	})
	.when('/edit_customer/:id', {
		templateUrl: 'customer_form.html',
	})
	.when('/settings', {
		templateUrl : 'settings.html',
	})
	.when('/only', {
		templateUrl : 'request_only.html',
	})
	.otherwise({redirectTo:'/'});
});

angApp.service('requestUtils', function() {
	this.checkTechnicians = function(){
	    const INPUT_REQUESTERS = {
            "operation": {
                "details": {}
            }
        };

        //Show loading thing:
        basicPostRequest(getBaseRequester(), INPUT_REQUESTERS, OPERATIONS[4], function(technicians){
            Lockr.set('technicians', technicians.operation.details);
            baseMessage("Requesters syncronized with ManageEngine", 'success', 2000, function(){});
        }, function(error){
            //Show error
            baseMessage(error.message, 'error', 2000, function(){  });
        });
	}

	this.checkRequests = function(){
        const BASE_GET = {
            "operation": {
                "details": {
                    "from": "0",
                    "limit": "1",
                    "filterby": "All_Requests",
                    "name": "GET_REQUESTS",
                    "OPERATION_NAME" : "GET_REQUESTS",
                },
                "name": "GET_REQUESTS",
                "OPERATION_NAME" : "GET_REQUESTS",
            }
        };

        //Show loading thing:
        basicPostRequest(getBaseRequest(), BASE_GET, OPERATIONS[3], function(requests){
            Lockr.set('requests', requests.operation.details);
            baseMessage("Requests syncronized with ManageEngine", 'success', 2000, function(){});
        }, function(error){
            console.log(error);
            baseMessage(error.message, 'error', 2000, function(){});
        });
	}
	
    this.getLastSeq = function(list){
        var output = "000";
        if(!(list == undefined || list == null || list.length == 0)){
            let last = output;

            if(!(list[0].SUBJECT === undefined)){
                last = list[0].SUBJECT;
            }else if(!(list[0].subject === undefined)){
                last = list[0].subject;
            }else if(!(list[0]['ticket number'] === undefined)){
                last = list[0]['ticket number'];
            }
            
            
            if(parseInt(last) !== undefined){
                var next = parseInt(last);
                output = PRINTJ.sprintf("%03d", next);
            }
        }

        return output;
    }
    this.getNextSeq = function(list){
        var last = this.getLastSeq(list);
        var output = "001";

        if(parseInt(last) != undefined){
            var next = parseInt(last) + 1;
            output = PRINTJ.sprintf("%03d", next);
        }

        return output;
    }
});

angApp.filter('capitalize', function() {
    return function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
});

angApp.controller('mainCtrl', function($scope, $window, requestUtils) {
	$scope.semester = Lockr.get('settings').semester;
    //
    if(Lockr.get('technicians') == false || Lockr.get('technicians') == undefined || Lockr.get('technicians').length == 0 || Lockr.get('technicians') == {}){
        requestUtils.checkTechnicians();
    }else{
        console.log(Lockr.get('technicians'));
    }
    //requestUtils.checkRequests();
});

function basicPostRequest(URL, input, operation_name, callBackOk, callBackError){
    let options = {
        method: 'POST',
        uri: URL,
        timeout: 10000,
        form: {
            format: "json", 
            TECHNICIAN_KEY: Lockr.get('settings').key,
            INPUT_DATA: JSON.stringify(input), 
            OPERATION_NAME: operation_name,
        },
        json: true,
    };
    
    // Automatically stringifies the body to JSON
    rp(options)
    .then(function (parsedBody) {
        // POST succeeded...
        console.log(parsedBody);
        callBackOk(parsedBody);
    })
    .catch(function (err) {
        // POST failed...
        console.log(err);
        callBackError(err);
    });
}

function getBaseRequest(){
    return PRINTJ.sprintf("http://%s/sdpapi/request", Lockr.get('settings').ip);
}

function getBaseRequester(){
    return PRINTJ.sprintf("http://%s/sdpapi/requester", Lockr.get('settings').ip);
}

function goBack(){
    window.history.back();
}

function refresh(){
    window.location.reload(true);
}

function goToMain(){
    window.location.href = "#!/";
}

function baseMessage(text, type, time, callBack){
    new Noty({
        text: text,
        type: type,
        timeout: time,
        callbacks: {
            onClose: function() {
                callBack();
            }
        },
    }).show();   
}
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
    this.fetchCustomers = function(callBack){
        transactionSQL('SELECT * FROM customers', [], function(results){
            if(results.rows.length > 0){                
                var customers = [];

                for (var i = 0; i < results.rows.length; i++) {
                    customers.push(results.rows[i]);
                }

                if(callBack){
                    callBack(customers);
                }
            }
        });
    }

	this.checkTechnicians = function(){
	    const INPUT_REQUESTERS = {
            "operation": {
                "details": {}
            }
        };

        //Show loading thing:
        basicPostRequest(getBaseRequester(), INPUT_REQUESTERS, OPERATIONS[4], function(technicians){
            if(technicians.operation.details && technicians.operation.details.length > 0){
                //
                Lockr.set('technicians', technicians.operation.details.map(user => user.username));    
            }else{
                Lockr.set('technicians', ['administrator']);
            }
            
            baseMessage("Technicians syncronized with ManageEngine", 'success', 2000, function(){});
        }, function(error){
            //Show error
            baseMessage(getErrorMessage(error), 'error', 2000, function(){  });
        });
	}

	this.checkRequests = function(){
        const BASE_GET = {
            "operation": {
                "details": {
                    "from": "0",
                    "limit": "0",
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
            if(requests.operation.details && requests.operation.details.length > 0){
                var list = requests.operation.details[0];
                //
                if(!(list.SUBJECT === undefined)){
                    last = list.SUBJECT;
                }else if(!(list.subject === undefined)){
                    last = list.subject;
                }else if(!(list['ticket number'] === undefined)){
                    last = list['ticket number'];
                }
                //
                Lockr.set('lastSeq', PRINTJ.sprintf("%03d", last));
                //
                Lockr.set('requests', requests.operation.details);
            }else{
                Lockr.set('lastSeq', "000");
            }

            baseMessage("Requests syncronized with ManageEngine", 'success', 2000, function(){});
        }, function(error){
            baseMessage(getErrorMessage(error), 'error', 2000, function(){});
        });
	}
    
    this.getNextSeq = function(){
        var last = Lockr.get('lastSeq');
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

angApp.filter('isnull', function() {
    return function(string) {
        if(string == "" || string == "undefined" || string == undefined){
            return "-";
        }

        return string;
    };
});

angApp.controller('mainCtrl', function($scope, $window, requestUtils) {
	$scope.semester = Lockr.get('settings').semester;
    /*
    if(Lockr.get('technicians') == false || Lockr.get('technicians') == undefined || Lockr.get('technicians').length == 0 || Lockr.get('technicians') == {}){
        requestUtils.checkTechnicians();
    }else{
        console.log(Lockr.get('technicians'));
    }
    */
});

jconfirm.defaults = {
    useBootstrap: false,
    boxWidth: "50%",
};

function getErrorMessage(error){
    var message = "Invalid request";

    if(error.error.code == "ESOCKETTIMEDOUT"){
        message = "Connection timeout";
    }else if(error.error.code == "ECONNREFUSED"){
        message = "No connection to ManageEngine";
    }

    return message;
}

function saveError(error, input){
    baseMessage(getErrorMessage(error), 'error', 3000, goToMain);
    Lockr.sadd('storedRequests', {input: JSON.stringify(input), code: getErrorMessage(error)});
}

function checkAuthority(text, callBack){
    $.confirm({
        title: 'Confirm your identity',
        content: '<form action="" class="ui form formPassword">' +
            '<div class="field">' +
                '<label>'+ text + "<br/>If so, type your account's password."+ '</label>' +
                '<input type="password" placeholder="password" class="password form-control" required/>' +
            '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'Submit',
                btnClass: 'btn-blue',
                action: function () {
                    const password = this.$content.find('.password').val();
                    
                    if(!password){
                        $.confirm({title: 'Warning', content: 'Provide a valid password'});
                        return false;
                    }else if(md5(password) != Lockr.get('session')['password']){
                        $.confirm({title: 'Warning', content: 'Wrong password'});
                        return false;
                    }

                    callBack();
                }
            },
            cancel: function () {
                //close
                console.log('canceled');
            },
        },
        onContentReady: function () {
            // bind to events
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });
}

function loadingEffect(){
    scroll(0,0);

}

function basicPostRequest(URL, input, operation_name, callBackOk, callBackError){
    let options = {
        method: 'POST',
        uri: URL,
        timeout: 10000,
        family: 4,
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
    spop({
        template: text,
        style: type,
        autoclose: time,
        onClose: function() {
            callBack();
        }
    });
}
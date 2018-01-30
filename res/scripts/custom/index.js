const angApp = angular.module('angApp', ['ngRoute', 'ngMask']);
const rp = require('request-promise');

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
    .when('/work_order', {
        templateUrl : 'request_work.html',
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

//You are the guy, DANIEL!!!
angApp.factory('requestUtils', ['$rootScope', function($rootScope) {
    $rootScope.$on();
    var obj = {};

    obj.customerAdded = false;
    //obj.technicians = [];

    obj.updateRequest = function(input, message, target){
        //TODO;
    }

    obj.checkRequest = function(id, callBack){
        const url = getBaseRequest() + '/' + id;
        
        this.basicPostRequest(url, {}, "GET_RESOLUTION", function(request){
            callBack(request);
        });
    }
    
    //DONE
    obj.sendRequest = function(input, message, target){
        //Fetch Requests
        const BASE_GET = {
            "operation": {
                "details": {
                    "from": "0",
                    "limit": "0",
                    "filterby": "All_Requests"
                }
            }
        };
        const self = this;
        //Show loading thing:
        this.basicPostRequest(getBaseRequest(), BASE_GET, "GET_REQUESTS", function(requests){
            //Up Request
            var nextSeq = "001";

            if(requests.operation.details && requests.operation.details.length > 0){
                nextSeq = self.getNextSeq(requests.operation.details);   
            }

            //Send Request After That:
            input.operation.details.subject = nextSeq;
            
            self.basicPostRequest(getBaseRequest(), input, "ADD_REQUEST", function(requests){
                baseMessage(message, 'success', 2000, target);
            }, function(error){
                baseMessage(getErrorMessage(error), 'error', 3000, function(){
                    Lockr.sadd('storedRequests', {input: JSON.stringify(input), code: getErrorMessage(error)});
                });
            });            
        }, function(error){
            baseMessage(getErrorMessage(error), 'error', 3000, function(){
                Lockr.sadd('storedRequests', {input: JSON.stringify(input), code: getErrorMessage(error)});
            });
        });
    }

    //DONE
    obj.fetchCustomers = function(callBack){
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

    //DONE
    obj.checkTechnicians = function(){
        const INPUT_REQUESTERS = {
            "operation": {
                "details": {}
            }
        };

        //Show loading thing:
        this.basicPostRequest(getBaseRequester(), INPUT_REQUESTERS, "GET_ALL", function(technicians){
            if(technicians.operation.details && technicians.operation.details.length > 0){
                Lockr.set('technicians', technicians.operation.details.map(user => user.username));    
            }else{
                Lockr.set('technicians', []);
            }

            baseMessage("Technicians syncronized with ManageEngine", 'success', 2000, function(){});
        });
    }

    //DONE
    obj.checkOpenRequests = function(){
        const BASE_GET = {
            "operation": {
                "details": {
                    "from": "0",
                    "limit": "0",
                    "filterby": "Open_System"
                }
            }
        };

        //Show loading thing:
        this.basicPostRequest(getBaseRequest(), BASE_GET, "GET_REQUESTS", function(requests){
            //Up Request
            if(requests.operation.details.length != undefined && requests.operation.details.length > 0){
                Lockr.set('openRequests', requests.operation.details);
            }else{
                Lockr.set('openRequests', []);
            }
            
            baseMessage("Requests syncronized with ManageEngine", 'success', 2000, function(){});
        });
    }

    //DONE
    obj.checkRequests = function(){
        const BASE_GET = {
            "operation": {
                "details": {
                    "from": "0",
                    "limit": "0",
                    "filterby": "All_Requests"
                }
            }
        };

        //Show loading thing:
        this.basicPostRequest(getBaseRequest(), BASE_GET, "GET_REQUESTS", function(requests){
            //Up Request
            baseMessage("Requests syncronized with ManageEngine", 'success', 2000, function(){});
        });
    }

    //DONE
    obj.getNextSeq = function(list){ 
        const lastOne = (list[0].SUBJECT === undefined) ? list[0].subject : list[0].SUBJECT;
        const next = parseInt(lastOne) + 1;

        return PRINTJ.sprintf("%03d", next);
    }

    //DONE
    obj.basicPostRequest = function(URL, input, operation_name, callBackOk, callBackError){
        $rootScope.state = "loading";
        scroll(0,0);

        const options = {
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
            $rootScope.state = "";
            $rootScope.$apply();
            
            console.log(parsedBody);

            callBackOk(parsedBody);
        })
        .catch(function (err) {
            // POST failed...
            $rootScope.state = "";
            $rootScope.$apply();

            console.log(err);
            
            if(callBackError)
                callBackError(err);
            else
                baseMessage(getErrorMessage(err), 'error', 2000, function(){});

        });
    }
    //Object to return:
    return obj;
}]);

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
});

jconfirm.defaults = {
    useBootstrap: false,
    boxWidth: "50%",
};

function getErrorMessage(error){
    var message = "ManageEngine Down";

    if(error.error.code == "ESOCKETTIMEDOUT"){
        message = "Connection timeout";
    }else if(error.error.code == "ECONNREFUSED"){
        message = "No connection to ManageEngine";
    }

    return message;
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

function filterOnly(data, idVerified){
    return {
        "operation": {
            "details" : {
                "requesttemplate" : "Only G113 Support/Service Provided",
                "priority": "Low",
                "level": "Tier 1",
                "status": "closed",
                "location": "G113 – Student Help Desk",
                "semester": Lockr.get('settings')['semester'], 
                "ticket status": data.wereSolved,
                "device type": data.deviceType,
                "category": data.category,
                "description": data.description,
                "technician": data.technician,
                "requester": data.technician,
                "Student or Faculty?": data.customer.type,
                "resolution": data.solution,
                "customer name": data.customer.name,
                "Customer ID Verified?": idVerified,
            },
        },
    };
}

function filterIntake(data, idVerified){
    return {
        "operation": {
            "details" : {
                "requesttemplate" : "Default Request",
                "priority": "Low",
                "level": "Tier 1",
                "status": "open",
                "semester": Lockr.get('settings')['semester'],
                "location": "C151 – Computer Support Center",
                "category": data.category,
                "description": data.description,
                "technician": data.technician,
                "requester": data.technician,
                "ticket number": data.ticketNumber,
                "Student or Faculty?": data.customer.type,
                "customer name": data.customer.name,
                "device type": data.deviceType,
                "Customer ID Verified?": idVerified,
                "Is the charger included with the device?": data.withCharger,
                "Color of Device" : data.colorDevice,
                "phone number" : data.customer.phone,
                "Device Manufacturer Brand Name" : data.brandName,
                "email address" : data.customer.email,
                "Model Number of the Device" : data.modelNumber,
                "When and how is the best way to contact you?" : data.bestTime,
                "Operating System" : data.operatingSystem,
                "Is the device under warranty?" : data.withWarranty,
                "How old is the device?" : data.howOldIsDevice,
                "Is there anything that you would like to be educated or trained on related to the device?" : data.moreHelp,
                "Would you like Microsoft Office 365 installed on the device?" : data.wantOffice,
                "When is the last time you backed up all of your important files on the device?" : data.lastTimeBackup,
                "Would you like a free antivirus program installed on the device?" : data.wantAntivirus,
                "What is the password of the device?": data.passwordDevice,
            },
        },
    };
}

function filterRelease(data){
    return {
        "operation": {
            "details" : {
                "status": data.isClosed,
                "ticket status": data.status,
                "resolution": data.solution,
            },
        },
    };
}

function filterWork(data){
    return {
        "operation": {
            "details" : {
                "status": "closed",
                "ticket status": data.status,
                "resolution": data.solution,
            },
        },
    };
}

 
const API_KEY = 'key-6dfcdfcdd1f344c7b10ea6dcb8076cb1';
const DOMAIN = 'sandboxd0b16b8e00474a1aa88b2c1c5d38e426.mailgun.org';
//Load the request module
let request = require('request');
let mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });

//
//data.operation.details.category = input.category.$viewValue;
//data.operation.details.description = 
//data.operation.details.solution = input.solution.$viewValue;
//data.operation.details.technician = input.technician.$viewValue.username;
//data.operation.details.requester = input.technician.$viewValue.username;
//data.operation.details.subject = input.ticketNumber.$viewValue;
//data.operation.details.SUBJECT = input.ticketNumber.$viewValue; 
//data.operation.details["student or faculty"] = input.customer.$viewValue.type;
//data.operation.details["student id number (if faculty, put n/a)"] = input.customer.$viewValue.studentNumber;
//data.operation.details["customer name"] = input.customer.$viewValue.name;
//return data;

function addRequest(input, callBack){
    postRequest(BASE_REQUEST, input, OPERATIONS[0], callBack);
}

function getRequests(callBack){
    postRequest(BASE_REQUEST, JSON.stringify(BASE_GET), OPERATIONS[3], callBack);
}

function getRequesters(callBack){
    postRequest(BASE_REQUESTER, JSON.stringify(INPUT_REQUESTERS), OPERATIONS[4], callBack);
}

function closeRequest(x, callBack){
    postRequest(BASE_REQUEST+"/"+x, JSON.stringify(BASE_CLOSE), OPERATIONS[2], callBack);    
}

function postRequest(URL, input_data, operation_name, callBack){
    request.post({
        url:    URL,
        form:   {
            format: FORMAT, TECHNICIAN_KEY: TECHNICIAN_KEY,
            INPUT_DATA: input_data, OPERATION_NAME: operation_name
        }
    }, function(error, response, body){
        callBack(response, error, body);
    });
}

function getRequest(URL, input_data, operation_name, callBack){
    request.get({
        url:    URL,
        form:   {
            format: FORMAT, TECHNICIAN_KEY: TECHNICIAN_KEY,
            INPUT_DATA: input_data, OPERATION_NAME: operation_name
        }
    }, function(error, response, body){
        callBack(response, error, body);
    });
}

function simplePost(URL, input_data, callBack){
    request.post({
        url:    URL,
        form:  input_data
    }, function(error, response, body){
        callBack(response, error, body);
    });
}

function checkHttpStatus(error, response, body){
    if(error == undefined){
        return -1; // No Internet
    }
    return (error.statusCode != 200) ? 0 : 1;
}

function checkData(entity){
    //
    var callBack = function(error, response, body){
        var feedback = checkHttpStatus(error, response, body);

        if(feedback == -1){
            console.log('No connection');
        }else if(feedback == 0){
            console.log('Error: ' + body);
        }else{
            var a = $.parseJSON(body);
            var requests = a.operation.details;
            if(requests != undefined){
                Lockr.set(entity, requests);
                console.log(requests);
            }
        }
    }
    //
    if(entity == 'technicians'){
        getRequesters(callBack);    
    }else if(entity == 'requests'){
        getRequests(callBack);
    }
}

function checkTechnicians(){
    checkData('technicians');
}

function checkRequests(){
    checkData('requests');
}

function checkLastSeq(){
    checkRequests();
    setLastSeq();
}

function getLastSequence(list){
    var output = "000";

    if(!(list == undefined || list == null || list.length == 0 || list[0].SUBJECT === undefined)){
        let last = list[0].SUBJECT;
        
        if(parseInt(last) !== undefined){
            var next = parseInt(last);
            output = PRINTJ.sprintf("%03d", next);
        }
    }

    return output;
}

//return "000";
//}else{
//console.log(last);

function getNextSeq(list){
    var last = getLastSequence(list);
    var output = "001";

    if(parseInt(last) != undefined){
        var next = parseInt(last) + 1;
        output = PRINTJ.sprintf("%03d", next);
    }
    
    return output;
}

function goBack(){
    window.history.back();
}

const CALLBACK_GO_BACK = {
    onClose: function() {
        goBack();
    },
};

/*
angApp.controller('releaseCtrl', function($scope, $window, $http) {
    //
    $scope.semester = Lockr.get('settings').semester;
    /*
    if($scope.requests == undefined || $scope.requests.length == 0){
        $('#no_requests').modal('show');
        $window.location.href = '#!/main';
    }
    
});
*/

const API_KEY = 'key-6dfcdfcdd1f344c7b10ea6dcb8076cb1';
const DOMAIN = 'sandboxd0b16b8e00474a1aa88b2c1c5d38e426.mailgun.org';

//Load the request module
let request = require('request');
let mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });

function sendEmail(to, subject, content){
    let email = {
        from: 'FVTC <email@samples.mailgun.org>',
        to: 'ddanielsilva661@gmail.com',
        subject: 'Hello',
        text: 'Testing some Mailgun awesomeness!'
    };

    mailgun.messages().send(email, function (error, body) {
        //
        
        //
        Lockr.sadd('logs', body);
    });
};

/*
*/



function filterOnly(input){
    var data = {
        "operation": {
            "details" : {
                //"requester" : "administrator",
                "requesttemplate" : "Only G113 Support/Service Provided",
                "priority": "Low",
                "level": "Tier 1",
                "status": "closed",
            },
        },
    };

    data.operation.details.category = input.category.$viewValue;
    data.operation.details.description = input.description.$viewValue;
    data.operation.details.solution = input.solution.$viewValue;
    data.operation.details.technician = input.technician.$viewValue;
    data.operation.details.requester = input.technician.$viewValue;
    data.operation.details.subject = input.ticketNumber.$viewValue;
    data.operation.details.SUBJECT = input.ticketNumber.$viewValue; 
    data.operation.details["ticket number"] = input.ticketNumber.$viewValue;
    data.operation.details["student or faculty"] = input.customer.$viewValue.studentType;
    data.operation.details["student id number (if faculty, put n/a)"] = input.customer.$viewValue.studentNumber;
    data.operation.details["customer name"] = input.customer.$viewValue.name;

    return data;
}

function filterIntake(input){
    var data = {
        "operation": {
            "details" : {
                //"requester" : "administrator",
                "requesttemplate" : "Only G113 Support/Service Provided",
                "priority": "Low",
                "level": "Tier 1",
                "status": "closed",
            },
        },
    };

    data.operation.details.category = input.category.$viewValue;
    data.operation.details.description = input.description.$viewValue;
    data.operation.details.solution = input.solution.$viewValue;
    data.operation.details.technician = input.technician.$viewValue;
    data.operation.details.requester = input.technician.$viewValue;
    data.operation.details.subject = input.ticketNumber.$viewValue;
    data.operation.details.SUBJECT = input.ticketNumber.$viewValue; 
    data.operation.details["ticket number"] = input.ticketNumber.$viewValue;
    data.operation.details["student or faculty"] = input.customer.$viewValue.studentType;
    data.operation.details["student id number (if faculty, put n/a)"] = input.customer.$viewValue.studentNumber;
    data.operation.details["customer name"] = input.customer.$viewValue.name;

    return data;
}

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

//
function simplePost(URL, input_data, callBack){
    request.post({
        url:    URL,
        form:  input_data
    }, function(error, response, body){
        callBack(response, error, body);
    });
}
//
//$('#ticketNumber').mask('000000000');

function coreEmail(type, message){
    var db = admin.database();
    var ref = db.ref("/messages");
    ref.push({type: type, message: message}, function(error) {
      if (error) {
        console.log("Data could not be saved." + error);
      } else {
        console.log("Data saved successfully.");
      }
    });
}

function makeConfirm(text, ok, cancel){
    var n = new Noty({
        text: 'Do you want to continue? <input id="example" type="text">',
        buttons: [
          Noty.button(ok.text, 'btn btn-success', ok.callback, {id: 'button1', 'data-status': 'ok'}),
          Noty.button(cancel, 'btn btn-error', function () {
              console.log('button 2 clicked');
              n.close();
          })
        ]
    }).show();
}

function sendEmail(title, type){
    
    /*
    $.confirm({
        title: title,
        content: 'url:modals/email.html',
        buttons: {
            ok: function(){
                var result = this.$content.find('#message').val();
                if(result.trim()){
                    coreEmail(type, result);
                }else{
                    $.alert('Message cannot be empty');
                }
            },
            close: function(){
            }
        },
        columnClass: 'medium',
    });*/
}

function checkLastSeq(){
    getRequests(function(error, response, body){
        var feedback = checkHttpStatus(error, response, body);
        if(feedback == -1){
            console.log('No connection');
        }else if(feedback == 0){
            console.log('Error: ' + body);
        }else{
            var a = $.parseJSON(body);
            var requests = a.operation.details;
            
            if(requests == undefined){
                setLastSeq();   
            }else{
                Lockr.set('requests',requests);
                setLastSeq();
            }
        }
    });
}

function checkTechnicians(){
    getRequesters(function(error, response, body){
        var feedback = checkHttpStatus(error, response, body);
        if(feedback == -1){
            console.log('No connection');
        }else if(feedback == 0){
            console.log('Error: ' + body);
        }else{
            var a = $.parseJSON(body);
            var requests = a.operation.details;
            if(requests != undefined){
                //setTechnicians(requests);
                Lockr.set('technicians',requests);
            }
        }
    });
}

function checkRequests(){
    getRequests(function(error, response, body){
        var feedback = checkHttpStatus(error, response, body);
        if(feedback == -1){
            console.log('No connection');
        }else if(feedback == 0){
            console.log('Error: ' + body);
        }else{
            var a = $.parseJSON(body);
            var requests = a.operation.details;
            if(requests != undefined){
                Lockr.set('requests',requests);
                //setRequests(requests);
            }
        }
    });
}

function checkHttpStatus(error, response, body){
    if(error == undefined){
        return -1; // No Internet
    }else if(error.statusCode != 200){
        return 0;
    }
    return 1
}


function getLastSequence(list){
    if(list == undefined || list == null || list.length == 0){
        //alert("HEHEH");
        return "000-L";
    }else{
        var last = list[0].SUBJECT;
        console.log(last);
        if(parseInt(last) != undefined){
            var next = parseInt(last);
            return PRINTJ.sprintf("%03d-%s", next, last[4]);
        }else
            return "000-L";
    }
}

function getNextSeq(list){
    var last = getLastSequence(list);
    if(parseInt(last) != undefined){
        var next = parseInt(last) + 1;
        return PRINTJ.sprintf("%03d-%s", next, last[4]);
    }else
        return "001-L";
}

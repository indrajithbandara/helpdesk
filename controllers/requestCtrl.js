angApp.controller('intakeCtrl', function($scope, $window, $http) {
	$scope.semester = Lockr.get('settings').semester;
    $scope.customers = [];
    $scope.customer = {};

    $scope.idVerified = "No";

    $scope.categories = CATS;
    $scope.category = $scope.categories[0].value;
    //
    $scope.deviceTypes = DEVICE_TYPES;
    $scope.deviceType = $scope.deviceTypes[0].value;

    //Check customers:
    //Colocar Load bar
    $scope.technicians = Lockr.get('technicians');
    $scope.requests    = Lockr.get('requests');    
    
    $scope.technician = $scope.technicians[0];
    $scope.request = $scope.requests[0];    
    
    $scope.lastSeq      = getLastSequence($scope.requests);
    $scope.ticketNumber = getNextSeq($scope.requests);
    //
    //
    transactionSQL('SELECT * FROM customers', [], function(results){
        if(results.rows.length > 0){                
            $scope.customers = [];
            
            for (var i = 0; i < results.rows.length; i++) {
                $scope.customers.push(results.rows[i]);
            }

            $scope.customer = $scope.customers[0];
            $scope.$apply();
        }
    });
    //
    $scope.isSameTicket = function(ticket){
        return $scope.tickets.includes(ticket);
    }
    
    $scope.save = function() {
        console.log($scope.intakeRequest);
        console.log("After Filter");
        console.log($scope.filterIntake($scope.intakeRequest));
        /*
        let filteredData = filterOnly(data);
        console.log(filteredData);
        
        addRequest(JSON.stringify(filteredData), function(response, error, body){    
            if(response && response.statusCode == 200){
                let status = $.parseJSON(body).operation.result.status, message = $.parseJSON(body).operation.result.message;
                new Noty({
                    text: status + ": " + message,
                    type: 'success',
                    timeout: 1000,
                    callbacks: CALLBACK_GO_BACK,
                }).show(); 
            }else{
                new Noty({
                    text: "Error: " + error,
                    type: 'error',
                    timeout: 1000,
                    callbacks: CALLBACK_GO_BACK,
                }).show(); 
                code = error.statusCode ? error.statusCode : -1;
                Lockr.sadd('storedRequests', {input: JSON.stringify(filteredData), code: code});
            }
        });
        */
    };

    function filterIntake(data){
        return {
            "operation": {
                "details" : {
                    "requesttemplate" : "Only G113 Support/Service Provided",
                    "priority": "Low",
                    "level": "Tier 1",
                    "status": "closed",
                    "semester": $scope.semester,
                    "location": "Only G113 Support/Service Provided",
                    "category": data.category,
                    "description": data.description,
                    "solution": data.solution,
                    "technician": data.technician,
                    "requester": data.technician,
                    "subject": data.ticketNumber,
                    "ticket number": input.ticketNumber,
                    "student or faculty": data.customer.studentType,
                    "customer name": data.customer.name,
                },
            },
        };
        //
    };
});

//"requester" : "administrator",
//data.operation.details.category = data.category.$viewValue;
//data.operation.details.description = data.description.$viewValue;
//data.operation.details.solution = data.solution.$viewValue;
//data.operation.details.technician = data.technician.$viewValue;
//data.operation.details.requester = data.technician.$viewValue;
//data.operation.details.subject = input.ticketNumber.$viewValue;
//data.operation.details.SUBJECT = input.ticketNumber.$viewValue; 
//data.operation.details["ticket number"] = input.ticketNumber.$viewValue;
//data.operation.details["student or faculty"] = input.customer.$viewValue.studentType;
//data.operation.details["customer name"] = input.customer.$viewValue.name;
//data.operation.details["student id number (if faculty, put n/a)"] = input.customer.$viewValue.studentNumber;
//return data;

angApp.controller('onlyCtrl', function($scope, $window, $http) {
    //
    $scope.semester = Lockr.get('settings').semester;
    $scope.idVerified = "No";

    $scope.customers = [];
    $scope.customer = {};
    
    $scope.categories = CATS;
    $scope.category = $scope.categories[0].value;
    //Check customers:
    //Colocar Load bar
    $scope.technicians = Lockr.get('technicians');
    $scope.technician = $scope.technicians[0];

    $scope.requests    = Lockr.get('requests');    
    $scope.request = $scope.requests[0];    
    
    $scope.lastSeq      = getLastSequence($scope.requests);
    $scope.ticketNumber = getNextSeq($scope.requests);
    
    transactionSQL('SELECT * FROM customers', [], function(results){
        if(results.rows.length > 0){                
            $scope.customers = [];
            
            for (var i = 0; i < results.rows.length; i++) {
                $scope.customers.push(results.rows[i]);
            }

            $scope.customer = $scope.customers[0];
            $scope.$apply();
        }
    });
    
    $scope.isSameTicket = function(ticket){
        return $scope.tickets.includes(ticket);
    }
    
    $scope.save = function() {
        console.log($scope.onlyRequest);
        console.log("After Filter");
        console.log($scope.filterOnly($scope.onlyRequest));
        /*
        let filteredData = filterOnly(data);
        console.log(filteredData);
        
        addRequest(JSON.stringify(filteredData), function(response, error, body){    
            if(response && response.statusCode == 200){
                let status = $.parseJSON(body).operation.result.status, message = $.parseJSON(body).operation.result.message;
                new Noty({
                    text: status + ": " + message,
                    type: 'success',
                    timeout: 1000,
                    callbacks: CALLBACK_GO_BACK,
                }).show(); 
            }else{
                new Noty({
                    text: "Error: " + error,
                    type: 'error',
                    timeout: 1000,
                    callbacks: CALLBACK_GO_BACK,
                }).show(); 
                code = error.statusCode ? error.statusCode : -1;
                Lockr.sadd('storedRequests', {input: JSON.stringify(filteredData), code: code});
            }
        });
        */
    };

    $scope.filterOnly = function(data){
        return {
            "operation": {
                "details" : {
                    "requesttemplate" : "Only G113 Support/Service Provided",
                    "priority": "Low",
                    "level": "Tier 1",
                    "status": "closed",
                    "location": "Only G113 Support/Service Provided",
                    "semester": $scope.semester, 
                    "ticket status": data.wereSolved,
                    "category": data.category,
                    "description": data.description,
                    "technician": data.technician.username,
                    "requester": data.technician.username,
                    "subject": data.ticketNumber,
                    "student of faculty": data.customer.type,
                    "customer name": data.customer.name,
                    "customer id verified": $scope.idVerified,
                },
            },
        };
    };
});

/*
angApp.controller('requestCtrl', function($scope, $window, $http) {
	//
    $scope.semester = Lockr.get('settings').semester;
    $scope.storedRequests = Lockr.get('storedRequests');

    if($scope.storedRequests == undefined || $scope.storedRequests.length == 0){
        $('#no_requests').modal('show');
        $window.location.href = '#!/main';
    }
    //
});
*/
angApp.controller('intakeCtrl', function($scope, $window, $http, requestUtils) {
    $('#ticketNumber').mask('000');
	$scope.semester = Lockr.get('settings').semester;
    $scope.state = "";
    $scope.idVerified = "No";
    $scope.userAgreement = "No";
    
    $scope.intakeRequest = {};

    $scope.intakeRequest.withWarranty = "No";    
    $scope.intakeRequest.withCharger = "No";    
    $scope.intakeRequest.wantOffice = "No";    
    $scope.intakeRequest.wantAntivirus = "No";    
    //
    $scope.customers = [];
    $scope.categories = CATS;
    $scope.deviceTypes = DEVICE_TYPES;
    $scope.technicians = Lockr.get('technicians');
    $scope.requests    = Lockr.get('requests');    
    //
    $scope.intakeRequest.customer = {};
    $scope.intakeRequest.category = $scope.categories[0].value;
    $scope.intakeRequest.deviceType = $scope.deviceTypes[0].value;

    if($scope.requests !== undefined){
        $scope.intakeRequest.request = $scope.requests[0];    
        //
    }
    
    if($scope.technicians !== undefined)
        $scope.intakeRequest.technician = $scope.technicians[0];
    
    //Check customers:
    //Colocar Load bar
    $scope.lastSeq      = requestUtils.getLastSeq($scope.requests);
    $scope.ticketNumber = requestUtils.getNextSeq($scope.requests);
    $scope.intakeRequest.ticketNumber = $scope.ticketNumber;
    
    transactionSQL('SELECT * FROM customers', [], function(results){
        if(results.rows.length > 0){                
            $scope.customers = [];
            
            for (var i = 0; i < results.rows.length; i++) {
                $scope.customers.push(results.rows[i]);
            }

            $scope.intakeRequest.customer = $scope.customers[0];
            $scope.$apply();
        }
    });
    //
    $scope.isSameTicket = function(ticket){
        return $scope.tickets.includes(ticket);
    }
    
    $scope.save = function() {
        var input = $scope.filterIntake($scope.intakeRequest);
        console.log(input);
        $scope.state = "loading";

        basicPostRequest(getBaseRequest(), input, OPERATIONS[0], function(requests){
            baseMessage('G151 Request saved succesfully!', 'success', 2000, goToMain);
            requestUtils.checkRequests();
            $scope.state = "";
        }, function(error){
            baseMessage(error.message, 'error', 3000, goToMain);
            Lockr.sadd('storedRequests', {input: JSON.stringify(input), code: code});
            $scope.state = "";
        });        
    };

    $scope.filterIntake = function(data){
        return {
            "operation": {
                "details" : {
                    "requesttemplate" : "Default Request",
                    "priority": "Low",
                    "level": "Tier 1",
                    "status": "open",
                    "semester": $scope.semester,
                    "location": "C151 – Computer Support Center",
                    "category": data.category,
                    "description": data.description,
                    "technician": data.technician.username,
                    "requester": data.technician.username,
                    "subject": data.ticketNumber,
                    "ticket number": data.ticketNumber,
                    "student or faculty": data.customer.type,
                    "customer name": data.customer.name,
                    //
                    "device type": data.deviceType,
                    "customer id verified": $scope.idVerified,
                    "Is the charger included with the device?": data.withCharger,
                    "Color of the Device" : data.colorDevice,
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
    };
});

angApp.controller('onlyCtrl', function($scope, $window, $http, requestUtils) {
    $('#ticketNumber').mask('000');
    //Init Form:
    $scope.onlyRequest = {};
    //
    $scope.semester = Lockr.get('settings').semester;
    $scope.idVerified = "No";
    $scope.state = "";
    //
    $scope.customers = [];
    $scope.categories = CATS;
    $scope.deviceTypes = DEVICE_TYPES;
    $scope.technicians = Lockr.get('technicians');
    $scope.requests    = Lockr.get('requests');    
    //Check customers:
    //Colocar Load bar
    $scope.onlyRequest.customer = {};
    $scope.onlyRequest.wereSolved = "Resolved";

    $scope.onlyRequest.category = $scope.categories[0].value;
    $scope.onlyRequest.deviceType = $scope.deviceTypes[0].value;
    
    if($scope.requests.length > 0)
        $scope.onlyRequest.request = $scope.requests[0];    
    
    if($scope.technicians.length > 0)
        $scope.onlyRequest.technician = $scope.technicians[0];

    //
    $scope.lastSeq      = requestUtils.getLastSeq($scope.requests);
    $scope.ticketNumber = requestUtils.getNextSeq($scope.requests);
    $scope.onlyRequest.ticketNumber = $scope.ticketNumber;
    
    transactionSQL('SELECT * FROM customers', [], function(results){
        if(results.rows.length > 0){                
            $scope.customers = [];
            
            for (var i = 0; i < results.rows.length; i++) {
                $scope.customers.push(results.rows[i]);
            }

            $scope.onlyRequest.customer = $scope.customers[0];
            $scope.$apply();
        }
    });
    
    $scope.isSameTicket = function(ticket){
        return $scope.tickets.includes(ticket);
    }
    
    $scope.save = function() {
        $scope.state = "loading";
        var input = $scope.filterOnly($scope.onlyRequest);
        console.log(input);
        
        basicPostRequest(getBaseRequest(), input, OPERATIONS[0], function(requests){
            baseMessage('G113 Request saved succesfully!', 'success', 2000, goToMain);
            requestUtils.checkRequests();
            $scope.state = "";
        }, function(error){
            baseMessage(error.message, 'error', 3000, goToMain);
            $scope.state = "";
            Lockr.sadd('storedRequests', {input: JSON.stringify(input), code: error.message});
        });
    };

    $scope.filterOnly = function(data){
        return {
            "operation": {
                "details" : {
                    "requesttemplate" : "Only G113 Support/Service Provided",
                    "priority": "Low",
                    "level": "Tier 1",
                    "status": "closed",
                    "location": "G113 – Student Help Desk",
                    "semester": $scope.semester, 
                    "ticket status": data.wereSolved,
                    "device type": data.deviceType,
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

const CATS = [
    { value: 'Data Recovery' }, 
    { value: 'Flash Drive' },
    { value: 'Forgot Password' }, 
    { value: 'Hardware' },
    { value: 'Internet' }, 
    { value: 'Keyboard' },
    { value: 'Malware' }, 
    { value: 'Monitor' },
    { value: 'Network' }, 
    { value: 'Operating System' },
    { value: 'Power Supply' }, 
    { value: 'Printer' },
    { value: 'Slow Computer' }, 
    { value: 'Smartphone' },
    { value: 'Software' }, 
    { value: 'Sound' },
    { value: 'Touchpad' },
    { value: 'Unbootable' },
    { value: 'Wi-fi' }
];

const DEVICE_TYPES = [
        { value: 'Desktop' }, 
        { value: 'Laptop' },
        { value: 'Mobile Device' }, 
        { value: 'Other' },
];
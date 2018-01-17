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
    //
    $scope.intakeRequest.customer = {};
    $scope.intakeRequest.category = $scope.categories[0].value;
    $scope.intakeRequest.deviceType = $scope.deviceTypes[0].value;
    
    //console.log(Lockr.get('session').technician);
    
    if($scope.technicians !== undefined && $scope.technicians.length > 0)
        $scope.intakeRequest.technician = Lockr.get('session').technician;
    
    $scope.lastSeq      = Lockr.get('lastSeq');
    $scope.ticketNumber = requestUtils.getNextSeq();
    $scope.intakeRequest.ticketNumber = $scope.ticketNumber;

    requestUtils.fetchCustomers(function(customers){
        $scope.customers = customers;
        var size = customers.length;
        
        if(size > 0){
            $scope.intakeRequest.customer = $scope.customers[0];
        } 

        $scope.$apply();
    });

    $scope.addCustomer = function(){
        // Nice Job Daniel!!!
        let currentWindow = $window;
        let openWindow = $window.open("../ui/popup_customer.html");
        
        let pollTimer = $window.setInterval(function() {
            if (openWindow.closed !== false) { // !== is required for compatibility with Opera
                $window.clearInterval(pollTimer);
                
                if(Lockr.get('customer_added') === true){
                    Lockr.set('customer_added', false);

                    requestUtils.fetchCustomers(function(customers){
                        $scope.customers = customers;
                        
                        var size = customers.length;

                        if(size > 0){
                            $scope.intakeRequest.customer = $scope.customers[size-1];
                        } 

                        $scope.$apply();
                    });
                }
                //Update Customers
            }
        }, 100);
    }
    
    $scope.save = function() {
        var input = $scope.filterIntake($scope.intakeRequest);
        console.log(input);
        $scope.state = "loading";
        scroll(0,0);

        basicPostRequest(getBaseRequest(), input, OPERATIONS[0], function(requests){
            baseMessage('G151 Request saved succesfully!', 'success', 2000, goToMain);
            requestUtils.checkRequests();
            //$scope.state = "";
        }, function(error){
            saveError(error, input);
        });

        $scope.state = "";
    };

    $scope.filterIntake = function(data){
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
                    "subject": data.ticketNumber,
                    "ticket number": data.ticketNumber,
                    "Student or Faculty?": data.customer.type,
                    "customer name": data.customer.name,
                    //
                    "device type": data.deviceType,
                    "Customer ID Verified?": $scope.idVerified,
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
    };
});

angApp.controller('onlyCtrl', function($scope, $window, $http, requestUtils) {
    $('#ticketNumber').mask('000');
    //Init Form:
    $scope.onlyRequest = {};
    $scope.semester = Lockr.get('settings').semester;
    $scope.idVerified = "No";
    $scope.state = "";
    
    $scope.customers = [];
    $scope.categories = CATS;
    $scope.deviceTypes = DEVICE_TYPES;
    $scope.technicians = Lockr.get('technicians');
    //Check customers:
    //Colocar Load bar
    $scope.onlyRequest.customer = {};
    $scope.onlyRequest.wereSolved = "Resolved";

    $scope.onlyRequest.category = $scope.categories[0].value;
    $scope.onlyRequest.deviceType = $scope.deviceTypes[0].value;
    
    if($scope.technicians.length > 0)
        $scope.onlyRequest.technician = Lockr.get('session').technician;

    $scope.lastSeq      = Lockr.get('lastSeq'); //requestUtils.getLastSeq(Lockr.get('requests'));
    $scope.ticketNumber = requestUtils.getNextSeq();
    $scope.onlyRequest.ticketNumber = $scope.ticketNumber;

    requestUtils.fetchCustomers(function(customers){
        $scope.customers = customers;
        var size = customers.length;

        if(size > 0){
            $scope.onlyRequest.customer = $scope.customers[0];
        } 

        $scope.$apply();
    });
    
    $scope.isSameTicket = function(ticket){
        return $scope.tickets.includes(ticket);
    }

    $scope.addCustomer = function(){
        // Nice Job Daniel!!!
        let openWindow = $window.open("../ui/popup_customer.html");
        
        let pollTimer = $window.setInterval(function() {
            if (openWindow.closed !== false) { // !== is required for compatibility with Opera
                $window.clearInterval(pollTimer);

                if(Lockr.get('customer_added') === true){
                    Lockr.set('customer_added', false);
                    
                    requestUtils.fetchCustomers(function(customers){
                        $scope.customers = customers;
                        
                        var size = customers.length;

                        if(size > 0){
                            $scope.onlyRequest.customer = $scope.customers[size-1];
                        } 

                        $scope.$apply();
                    });
                }
                else{
                    console.log('Canceled');
                }
                //Update Customers
            }else{
                //Keep the focus
                openWindow.focus();   
            }
        }, 100);
    }
    
    $scope.save = function() {
        $scope.state = "loading";
        var input = $scope.filterOnly($scope.onlyRequest);
        console.log(input);
        scroll(0,0);
        
        basicPostRequest(getBaseRequest(), input, OPERATIONS[0], function(requests){
            baseMessage('G113 Request saved succesfully!', 'success', 2000, goToMain);
            requestUtils.checkRequests();
            //$scope.state = "";
        }, function(error){
            saveError(error, input);
        });
        
        $scope.state = "";
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
                    "semester": Lockr.get('settings')['semester'], 
                    "ticket status": data.wereSolved,
                    "device type": data.deviceType,
                    "category": data.category,
                    "description": data.description,
                    "technician": data.technician,
                    "requester": data.technician,
                    "subject": data.ticketNumber,
                    "Student or Faculty?": data.customer.type,
                    "resolution": data.solution,
                    "customer name": data.customer.name,
                    "Customer ID Verified?": $scope.idVerified,
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

angApp.controller('releaseCtrl', function($scope, $window, $http, requestUtils) {
    $scope.semester = Lockr.get('settings').semester;
    $scope.state = "";
    $scope.releaseRequest = {};

    $scope.releaseRequest.status = "Resolved";
    $scope.releaseRequest.userAgreement = "No";

    if(Lockr.get('requests') && Lockr.get('requests').length > 0){
        $scope.requests = Lockr.get('requests');
        $scope.requests = $scope.requests.filter(x => x.STATUS != 'Closed');

        //No Open requests:
        if($scope.requests && $scope.requests.length > 0){
            $scope.releaseRequest.request = $scope.requests[0];
        }else{
            //Go Back / Show Message:
            goToMain();
            $('#open_requests').modal('show');
        }
    }

    $scope.save = function(){
        $scope.state = "loading";
        scroll(0,0);
        var input = $scope.filterRelease($scope.releaseRequest);
        var id = $scope.releaseRequest.request.WORKORDERID;
        console.log(input);
        const url = getBaseRequest() + '/' + id;
        
        //Saving Stuffs Here:
        basicPostRequest(url, input, OPERATIONS[1], function(requests){
            baseMessage('Request updated succesfully!', 'success', 2000, goToMain);
            requestUtils.checkRequests();
            //$scope.state = "";
        }, function(error){
            baseMessage(getErrorMessage(error), 'error', 3000, goToMain);
        });

        $scope.state = "";
    }

    $scope.filterRelease = function(data){
        return {
            "operation": {
                "details" : {
                    "status": "closed",
                    "ticket status": data.status,
                    "resolution": data.solution,
                },
            },
        };
        //
    };
});


angApp.controller('requestCtrl', function($scope, $window, $http, requestUtils) {
    $scope.semester = Lockr.get('settings').semester;
    $scope.session = Lockr.get('session');
    $scope.state = "";
    $scope.selected = [];

    if(Lockr.get('storedRequests') && Lockr.get('storedRequests').length > 0){
        $scope.requests = Lockr.get('storedRequests');
        const size = $scope.requests.length;
        
        for(var i = 0; i < size; i++){
            var current = $scope.requests[i];
            $scope.requests[i].parsed = JSON.parse($scope.requests[i].input);
        }
    }else{
        //Go Back / Show Message:
        goToMain();
        $('#stored_requests').modal('show');
    }

    $scope.select = function(id){
        if($scope.selected.indexOf(id) == -1){
            $scope.selected.push(id);
        }else{
            $scope.selected =  $scope.selected.filter(e => e !== id);
        }

        console.log($scope.selected);
    }

    $scope.send = function(id, body){
        console.log(id);
        console.log(body);
        $scope.state = "loading";

        basicPostRequest(getBaseRequest(), body, OPERATIONS[0], function(requests){
            baseMessage('Request sent succesfully!', 'success', 2000, refresh);
            //Call Delete:
            $scope.deleteData(id);
            $scope.state = "";
        }, function(error){
            baseMessage(getErrorMessage(error), 'error', 3000, function(){});
            $scope.state = "";
        });
    }

    $scope.sendCascade = function(list, terminator){
        //console.log(list);
        if(terminator >= 1){
            $scope.state = "loading";
            //console.log(terminator);
            //console.log(list[terminator-1][1]);

            basicPostRequest(getBaseRequest(), list[terminator-1][1], OPERATIONS[0], function(requests){
                baseMessage('Request sent succesfully!', 'success', 2000, function(){
                    
                    $scope.deleteData(list[terminator-1][0]);

                    $scope.sendCascade(list, terminator - 1);    
                });
                //Call Delete:
            }, function(error){
                baseMessage(getErrorMessage(error), 'error', 3000, function(){
                    $scope.sendCascade(list, terminator - 1);
                });
            });

        }else{
            $scope.state = "";    
            refresh();
        }
    }

    $scope.sendSelected = function(){
        var selecteds = $scope.selected;
        var newArray = [];

        for (var i = 0; i < selecteds.length; i++) {
            newArray[i] = [selecteds[i], $scope.requests[selecteds[i]].parsed];
        }

        $scope.sendCascade(newArray, newArray.length);
    }

    $scope.sendAll = function(){
        var requests = $scope.requests;
        var newArray = [];
        
        for (var i = 0; i < requests.length; i++) {
            newArray[i] = [i, requests[i].parsed];
        }

        $scope.sendCascade(newArray, newArray.length);
    }

    $scope.delete = function(id){
        $scope.deleteData(id);
        //Show message:
        baseMessage('Request deleted succesfully!', 'success', 2000, refresh);
    };

    $scope.deleteAll = function(){
        Lockr.set('storedRequests', []);
        baseMessage('Requests deleted succesfully!', 'success', 2000, refresh);
    }

    $scope.deleteSelected = function(){
        var current = [];
        var temp = Lockr.get('storedRequests');

        for (var i = 0; i < temp.length; i++) {
            if($scope.selected.indexOf(i) === -1){
                current.push(temp[i]);
            }
        }

        Lockr.set('storedRequests', current);
        baseMessage('Requests deleted succesfully!', 'success', 2000, refresh);
    }

    $scope.deleteData = function(id){
        var current = [];
        var temp = Lockr.get('storedRequests');

        for (var i = 0; i < temp.length; i++) {
            if(i != id){
                current.push(temp[i]);
            }
        }

        Lockr.set('storedRequests', current);
    }
});
angApp.controller('intakeCtrl', function($scope, $window, $http, requestUtils) {    
    $scope.semester = Lockr.get('settings').semester;
    
    $scope.idVerified = $scope.userAgreement = "No";

    $scope.customers = [];
    $scope.categories = CATS;
    $scope.deviceTypes = DEVICE_TYPES;
    $scope.technicians = Lockr.get('technicians'); 
    
    $scope.intakeRequest = {
        withWarranty: "No",
        withCharger: "No",
        wantOffice: "No",
        wantAntivirus: "No",
        customer: {},
        category: $scope.categories[0].value,
        deviceType: $scope.deviceTypes[0].value
    };

    if($scope.technicians !== undefined && $scope.technicians.length > 0)
        $scope.intakeRequest.technician = Lockr.get('session').technician;
    
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
            }
        }, 100);
    }

    $scope.save = function() {
        requestUtils.sendRequest(filterIntake($scope.intakeRequest, $scope.idVerified), 'G151 Request saved succesfully!', goToMain);
    };
});

angApp.controller('onlyCtrl', function($scope, $window, $http, requestUtils) {
    //Init Form:
    $scope.idVerified = "No";
    $scope.categories = CATS;
    $scope.deviceTypes = DEVICE_TYPES;

    $scope.semester = Lockr.get('settings').semester;
    $scope.technicians = Lockr.get('technicians');
    //Check customers:
    $scope.onlyRequest = {
        customer: {
            name: "", 
            type: "Student",
        },
        wereSolved: "Resolved",
        category: $scope.categories[0].value,
        deviceType: $scope.deviceTypes[0].value,
    };
    
    if($scope.technicians.length > 0)
        $scope.onlyRequest.technician = Lockr.get('session').technician;
    
    $scope.isSameTicket = function(ticket){
        return $scope.tickets.includes(ticket);
    }
    
    $scope.save = function() {
        requestUtils.sendRequest(filterOnly($scope.onlyRequest, $scope.idVerified), 'G113 Request saved succesfully!', goToMain);
    };
});

angApp.controller('releaseCtrl', function($scope, $window, $http, requestUtils) {
    $scope.semester = Lockr.get('settings').semester;
    $scope.state = "";

    $scope.releaseRequest = {
        status: "Resolved",
        userAgreement: "No",
    };

    if(Lockr.get('openRequests') && Lockr.get('openRequests').length > 0){
        $scope.requests = Lockr.get('openRequests');
        $scope.requests = $scope.requests.filter(x => x.STATUS != 'Closed');

        //No Open requests:
        if($scope.requests && $scope.requests.length > 0){
            $scope.releaseRequest.request = $scope.requests[0];
        }
    }else{
        //Go Back / Show Message:
        goToMain();
        $('#open_requests').modal('show');
    }

    $scope.setCustomer = function(customer){
        console.log(customer);
    }

    $scope.setRequest = function(request){
        console.log(request);
    }

    $scope.save = function(){
        //$scope.state = "loading";
        
        var input = requestUtils.filterRelease($scope.releaseRequest);

        const id = $scope.releaseRequest.request.WORKORDERID;
        const url = getBaseRequest() + '/' + id;
        
        //Saving Stuffs Here:
        this.basicPostRequest(url, input, OPERATIONS[1], function(requests){
            baseMessage('Request updated succesfully!', 'success', 2000, goToMain);
            requestUtils.checkRequests();
            //$scope.state = "";
        }, function(error){
            baseMessage(getErrorMessage(error), 'error', 3000, goToMain);
            //$scope.state = "";
        });
    }
});

angApp.controller('workCtrl', function($scope, $window, $http, requestUtils) {
    $scope.semester = Lockr.get('settings').semester;
    
    $scope.workRequest = {
        "userAgreement": "No",
        "status": "Progress",
    };
    
    //$scope.workRequest.request = $scope.requests[0];
    //}else{        
        
    if(Lockr.get('openRequests') && Lockr.get('openRequests').length > 0){
        $scope.requests = Lockr.get('openRequests');
        
        //No Open requests:
        if(!($scope.requests && $scope.requests.length > 0)){
            //Go Back / Show Message:
            goToMain();
            $('#open_requests').modal('show');
        }
    }else{
        //Go Back / Show Message:
        goToMain();
        $('#open_requests').modal('show');
    }
    
    $scope.setRequest = function(request){
        console.log(request);
        requestUtils.checkRequest(request.WORKORDERID, function(req){

            if(req.operation.Details.RESOLUTION){
                $scope.workRequest.previousSolution = req.operation.Details.RESOLUTION;
            }else{
                $scope.workRequest.previousSolution = "";
            }
            
        });
    }

    $scope.save = function(){
        $scope.state = "loading";
        
        var input = requestUtils.filterWork($scope.workRequest);
        var id = $scope.workRequest.request.WORKORDERID;
        const url = getBaseRequest() + '/' + id;
        
        //Saving Stuffs Here:
        this.basicPostRequest(url, input, OPERATIONS[1], function(requests){
            baseMessage('Request updated succesfully!', 'success', 2000, goToMain);
            requestUtils.checkRequests();
            $scope.state = "";
        }, function(error){
            baseMessage(getErrorMessage(error), 'error', 3000, goToMain);
            $scope.state = "";
        });
    }
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
        $scope.deleteData(id);
        requestUtils.sendRequest(body, 'Request sent succesfully!', refresh);
    }

    $scope.sendCascade = function(list, terminator){
        if(terminator >= 1){
            $scope.state = "loading";

            this.basicPostRequest(getBaseRequest(), list[terminator-1][1], OPERATIONS[0], function(requests){
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
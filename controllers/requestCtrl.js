
angApp.controller('releaseCtrl', function($scope, $window, $http) {
    //
    $scope.semester = Lockr.get('settings').semester;
    /*
    if($scope.requests == undefined || $scope.requests.length == 0){
        $('#no_requests').modal('show');
        $window.location.href = '#!/main';
    }
    */
    //
});

angApp.controller('intakeCtrl', function($scope, $window, $http) {
	$scope.semester = Lockr.get('settings').semester;
    //

});

angApp.controller('onlyCtrl', function($scope, $window, $http) {
    //
    $scope.semester = Lockr.get('settings').semester;
    $scope.customers = [];
    $scope.customer = {};

    $scope.categories = CATS;
    $scope.category = $scope.categories[0].value;
    //Check customers:
    //Colocar Load bar
    $scope.technicians = Lockr.get('technicians');
    $scope.requests    = Lockr.get('requests');    
    
    $scope.technician = $scope.technicians[0];
    $scope.request = $scope.requests[0];    
    
    $scope.lastSeq      = getLastSequence($scope.requests);
    $scope.ticketNumber = getNextSeq($scope.requests);
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
    //
    //console.log(filteredData);
    //$.alert();
    //$.alert();
    //insertSQL();
    // goBack();
    
    $scope.save = function(data) {
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
        //
    };
});

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
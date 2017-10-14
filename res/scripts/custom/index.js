// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', ['ngRoute']);

// configure our routes
scotchApp.config(function($routeProvider) {
	$routeProvider
	.when('/main', {
		templateUrl : 'main.html',
		controller  : 'mainController'
	})
	.when('/user', {
		templateUrl : 'user.html',
		controller  : 'userController'
	})
	.when('/request', {
		templateUrl : 'request.html',
		controller  : 'requestController'
	})
	// route for the about page
	.when('/release', {
		templateUrl : 'release.html',
		controller  : 'releaseController'
	})
	// route for the about page
	.when('/intake', {
		templateUrl : 'intake.html',
		controller  : 'intakeController'
	})
	// route for the about page
	.when('/customer', {
		templateUrl : 'customer.html',
		controller  : 'customerController'
	})
	// route for the about page
	.when('/add_customer', {
		templateUrl : 'form_customer.html',
		controller  : 'addCustomerController'
	})
	// route for the about page
	.when('/settings', {
		templateUrl : 'settings.html',
		controller  : 'settingsController'
	})
	// route for the contact page
	.when('/only', {
		templateUrl : 'only.html',
		controller  : 'onlyController'
	});
});
//
scotchApp.controller('settingsController', function($scope, $window) {
	$scope.isLogged = function(){
		return $scope.user != {};
	}

	$scope.save = function() {
		setSemester({label: 'semester', value: $scope.semester});
		$.alert({
		    title: 'Alert!',
		    content: 'Data saved with success!',
		    buttons: {
        		ok: function(){
					//semester = getData('settings').value;
					$window.location.href = '#!/main';            	
        		},
        	}
		});
	};
});

scotchApp.controller('loginController', function($scope, $window) {
	$scope.$on('$viewContentLoaded', function() {
		$scope.user = {};
	});

	$scope.sendLogin = function() {
		var logged = login($scope.user.username, md5($scope.user.password));
		if(logged != false) {
			//setSession(logged);
			//session = getSession();  
			$scope.user = logged;
			$window.location.href = 'default.html';
		}else{
			//Error:
			new Noty({
				text: 'Wrong username or password',
				type: 'error',
			}).show();
			$("#username").focus();
		}
	};

});

scotchApp.controller('mainController', function($scope, $window, $http) {
	// create a message to display in our view
	$scope.$on('$viewContentLoaded', function() {
		$scope.semester = getData('settings').value;	
		$scope.requests = [];
		$scope.session = getSession();
		$scope.capitalize = capitalize;
		//Get Technicians:
		checkTechnicians();
		checkRequests();
		
		$scope.requests = getData('storedRequests');
		var requests = getData('requests');
		$scope.lastSeq = getLastSequence(requests);
		$scope.ticketNumber = getNextSeq(requests);
		$scope.customers = getData('customers');$scope.customer = $scope.customers[0];
		$scope.technicians = getData('technicians');$scope.technician = $scope.technicians[0].username;
		//
		var customers = getData('customers');
		$scope.customers = customers;
		$scope.studentNumbers = [];
		$scope.emails = [];
		//
		$scope.satisfactionLevel = SATISFACTION;
		$scope.satisfaction = $scope.satisfactionLevel[1].value;
		
		var temp = getData('requests');
	    
	    if(temp != undefined && temp.length > 0){
	    	$scope.requests = temp;
	    	$scope.request = temp[0].id;
    	}
		//
		$scope.capitalize = capitalize;
		//
		var requests = getData('requests');
		$scope.lastSeq = getLastSequence(requests);
		$scope.ticketNumber = getNextSeq(requests);

		$scope.customers = getData('customers');$scope.customer = $scope.customers[0];
		$scope.technicians = getData('technicians');$scope.technician = $scope.technicians[0].username;
		$scope.categories = CATS;$scope.category = $scope.categories[0].value;
		//
		$scope.categories = CATS;$scope.category = $scope.categories[0].value;
		$scope.colorOptions = COLORS;$scope.colorDevice = $scope.colorOptions[0].value;
		$scope.osOptions = OS;$scope.operatingSystem = $scope.osOptions[7].value;
		//
		//var customers = getData('customers');

		$scope.studentType = 'student';
		$scope.studentNumbers = [];
	    $scope.emails = [];
	    $scope.regex = '[0-9]{9}'; // Regex Padrao:
	});
	
	$scope.logout = function(){
		$scope.user = {};
		$window.location.href = 'default.html';
	};
	
	$scope.bug = function(){
		//
	};

	$scope.addon = function(){
		//
	};
	
	$scope.about = function(){
		$('#about').modal('show');
	};

	$scope.saveEntity = function(x){

	}

	$scope.editEntity = function(id, x){

	}

	$scope.deleteEntity = function(id){

	}

	$scope.viewEntity = function(id){

	}
});

scotchApp.controller('releaseController', function($scope, $window) {
	$scope.$on('$viewContentLoaded', function() {
		if($scope.requests == undefined || $scope.requests.length == 0){
			$('#no_requests').modal('show');
			$window.location.href = '#!/main';
    	}
	});

	$scope.save = function() {
		var selectedRequest = $("#ticketNumber").val();

		closeRequest(selectedRequest, function(error, response, body){
			if(response.statusCode == 200){
				var status = $.parseJSON(body).operation.result.status, message = $.parseJSON(body).operation.result.message;
				bootbox.alert(status + ":" + message, function(){
					$window.location.href = '#!/main';	
				})
			}else{
				bootbox.alert("Error: " + error);
			}
		});
	};
});

scotchApp.controller('intakeController', function($scope, $window) {
	$('#ticketNumber').mask('000-S');

	$scope.checkTicket = function(x){
		var requests = getData('requests');
		for (var i = 0; i < requests.length; i++) 
			if(requests[i].SUBJECT == x)
				return false;		
		return true;
	};

	// function to submit the form after all validation has occurred			
	$scope.save = function(data) {
		var filteredData = filterIntake(data);
		console.log(filteredData);
		addRequest(JSON.stringify(filteredData), function(response, error, body){
			if(response && response.statusCode == 200){
				var status = $.parseJSON(body).operation.result.status, message = $.parseJSON(body).operation.result.message;
				$.alert(status + ": " + message);
			}else{
				$.alert("Error: " + error);
				code = error.statusCode ? error.statusCode : -1;
				insertSQL('storedRequests', {input: JSON.stringify(filteredData), code: code});
			}
			$window.location.href = '#!/main';	
		});
 	};
});

scotchApp.controller('onlyController', function($scope, $window) {
	$('#ticketNumber').mask('000-S');
	
	$scope.checkTicket = function(x){
		var requests = getData('requests');
		for (var i = 0; i < requests.length; i++) 
			if(requests[i].SUBJECT == x)
				return false;		
		return true;
	};
				
	$scope.save = function(data) {
		var filteredData = filterOnly(data);
		console.log(filteredData);
		addRequest(JSON.stringify(filteredData), function(response, error, body){
			if(response && response.statusCode == 200){
				var status = $.parseJSON(body).operation.result.status, message = $.parseJSON(body).operation.result.message;
				$.alert(status + ": " + message);
			}else{
				$.alert("Error: " + error);
				code = error.statusCode ? error.statusCode : -1;
				insertSQL('storedRequests', {input: JSON.stringify(filteredData), code: code});
			}
			$window.location.href = '#!/main';	
		});
 	};
});

scotchApp.controller('requestController', function($scope, $window) {
	$scope.$on('$viewContentLoaded', function() {
		if(!$scope.requests || $scope.requests.length == 0){
			$.alert({title: 'Warning',
				type: 'red',
				content: 'No open requests!', 
				onClose: function () {
					$window.location.href = '#!/main';	
			    },
			});
		}
	});

	$scope.delete = function(id){
		$.confirm({
		    title: 'Warning!',
		    content: "Are you sure you want to remove the request: " + id + "?",
		    buttons: {
		        confirm: function () {
	            	deleteSQL("storedRequests", id);
		        	$.alert({title: 'Success',
        				content: 'Request deleted successfully!', 
        				onClose: function () {
        					$window.location.reload();
					    },
        			});
		        },
		        cancel: function () {}
		    }
		});
	}

	$scope.resend = function(id, input) {
		addRequest(input, function(response, error, body){
			if(response.statusCode == 200){
				var status = $.parseJSON(body).operation.result.status, message = $.parseJSON(body).operation.result.message;
				deleteSQL("storedRequests", id);
				$.alert("Request resent successfully!");
				$window.location.href = '#!/main';	
			}else{
				$.alert(error);
			}
		});
	};
});
//EXTRA:
scotchApp.controller('customerController', function($scope, $window) {
	$('#phoneNumber').mask('(000)000-0000');
	$('#studentNumber').mask('000000000');
	
	/*
	for (var i = 0; i < $scope.customers.length; i++) {
		$scope.studentNumbers.push($scope.customers[i].studentNumber);
		$scope.emails.push($scope.customers[i].emailAddress);
	}
	*/

	$scope.delete = function(id, name) {
		$.confirm({
		    title: 'Warning!',
		    content: "Are you sure you want to remove the customer: " + name + "?",
		    buttons: {
		        confirm: function () {
	            	deleteSQL('customers', id);

		        	$.alert({title: 'Success',
        				content: 'Customer deleted successfully!', 
        				onClose: function () {
        					$window.location.reload();
					    },
        			});
		        },
		        cancel: function () {
		        
		        }
		    }
		});
	};

});

scotchApp.controller('addCustomerController', function($scope, $window) {
	$scope.$on('$viewContentLoaded', function() {
		$("#studentNumber").mask('000000000');
		$("#phoneNumber").mask('(000)000-0000');

	    for (var i = 0; i < $scope.customers.length; i++) {
	    	if($scope.customers[i].studentNumber != 'N/A')
	        	$scope.studentNumbers.push($scope.customers[i].studentNumber);
	        $scope.emails.push($scope.customers[i].emailAddress);
	    }
	});

	$scope.change = function(studentType){
        if(studentType == 'faculty'){
            $("#studentNumber").unmask();
            $scope.regex = '[N][\/][A]';
            $scope.studentNumber = "N/A";
        }else{
            $("#studentNumber").mask('000000000');
        	$scope.regex = '[0-9]{9}';
        	$scope.studentNumber = "";
        }
	};

	// create a message to display in our view
	$scope.save = function() {
		var customer = {
			name: $scope.name,
			studentType: $scope.studentType,
			studentNumber: $scope.studentNumber,
			phoneNumber: $scope.phoneNumber,
			emailAddress: $scope.emailAddress,
		};

		insertSQL('customers', customer);

		$.alert({
		    title: 'Alert!',
		    content: 'Data saved with success!',
		});

		$window.location.href = getData('target');	
	};
});

scotchApp.controller('userController', function($scope, $window) {
	$scope.$on('$viewContentLoaded', function() {
		if($scope.user.role == "admin")
			$scope.users = getData('users'); 
		else
			$scope.users = [session];
	});
	
	

	$scope.add = function() {
		$.confirm({
		    title: 'Add User',
		    content: 'url:modals/add_user.html',
		    buttons: {
		        ok: function(){
		        	var username = this.$content.find('#username').val();
		        	var varrole = this.$content.find('#role').val();
		        	var password = this.$content.find('#password').val();
		        	var confirm_password = this.$content.find('#confirm_password').val();

		        	var data = {username: username, password: md5(password), role: varrole};

		        	if(!username.trim() || !varrole.trim() || !password.trim() || !confirm_password.trim()){
		        		$.alert('Form must be entirely filled!');	
		        	}else{
		        		if(password != confirm_password){
		        			$.alert('Passwords must match!');		
		        		}else{
		        			insertSQL('users', data);
		        			$.alert({title: 'Success',
		        				content: 'User added successfully!', 
		        				buttons: {
        							ok: function(){
			        					$scope.users = getData('users');
								        $window.location.reload();
							    	}
							    },
							    //
		        			});
		        			//
		        		}
		        	}
		        },
		        close: function(){

		        }
		    },
		});
	};

	$scope.edit = function(user){
		var session = getSession();

		$.confirm({
		    title: 'Add User',
		    content: 'url:modals/add_user.html',
		    onOpen: function(data, status, xhr){
		        // when content is fetched
		        this.setContentAppend('<script type="text/javascript">'+
		        '$("#username").val("'+user.username+'");'+
		        '$("#role").val("'+user.role+'");'+
		        '</script>');
		        
		        if(session.id == user.id){
		        	this.setContentAppend('<script type="text/javascript">'+
			        '$("#role").attr("readonly","readonly");'+
			        '$("#role").attr("disabled","disabled");'+
			        '</script>');
		        }
		        
		        //alert(session.username);

		        if(session.username == 'admin'){
		        	this.setContentAppend('<script type="text/javascript">'+
			        '$("#username").attr("readonly","readonly");'+
			        '$("#username").attr("disabled","disabled");'+
			        '$("#role").attr("readonly","readonly");'+
			        '$("#role").attr("disabled","disabled");'+
			        '</script>');	
		        }
	        	
	        	this.$content.find('#role').val(user.role);
	        	this.$content.find('#password').val();
	        	this.$content.find('#confirm_password').val();
		    },
		    buttons: {
		        ok: function(){
		        	var username = this.$content.find('#username').val();
		        	var varrole = this.$content.find('#role').val();
		        	var password = this.$content.find('#password').val();
		        	var confirm_password = this.$content.find('#confirm_password').val();
		        	var data = null;
		        	//Checking Data:
		        	if(!password.trim() && !confirm_password.trim() && (username.trim() && varrole.trim())){ // Without change password
		        		data = {username: username, role: varrole, id:user.id, password: user.password};
		        		updateSQL('users', user.id, data);
		        		
		        		
		        		if(session.id = user.id){
		        			//alert('HUEHUEHUE');
		        			//alert(data.username);
		        			//console.log('HAWKEYE');
		        			setSession(data);
		        			//$scope.users = [data];
		        		}
		        		//console.log(data);
		        		$.alert({title: 'Success',
	        				content: 'User updated successfully!', 
	        				onClose: function () {
	        					$scope.users = getData('users');
						        $window.location.reload();
						    },
	        			});
		        	}else if(password.trim() && confirm_password.trim() && username.trim() && varrole.trim()){ //Everything check the pass:
		        		if(password != confirm_password){
		        			$.alert('Passwords must match!');		
		        		}else{
		        			data = {username: username, password: md5(password), role: varrole, id:user.id};
		        			updateSQL('users', user.id, data);
		        			
		        			if(session.id = user.id){
			        			setSession(data);
			        			//session = user;
			        			//$scope.users = [user];
			        		}

		        			$.alert({title: 'Success',
		        				content: 'User updated successfully!', 
		        				onClose: function () {
		        					$scope.users = getData('users');
							        $window.location.reload();
							    },
		        			});
		        		}
		        	}else{
		        		$.alert('Form must be entirely filled!');	
		        	}
		        	//console.log(data);
		        	//$scope.users = [data];
		        },
		        close: function(){}
		    },
		});
	};

	$scope.delete = function(id, username) {
		$.confirm({
		    title: 'Warning!',
		    content: "Are you sure you want to remove the user: " + username + "?",
		    buttons: {
		        confirm: function () {
		            if(username != "admin" && username != session.username){
			        	deleteSQL('users', id);

			        	$.alert({title: 'Success',
	        				content: 'User deleted successfully!', 
	        				onClose: function () {
	        					$window.location.reload();
						    },
	        			});
			        }else{
			        	$.alert('Delete the user "'+username+'" is not allowed');
			        }
		        },
		        cancel: function () {
		        
		        }
		    }
		});
	};
});
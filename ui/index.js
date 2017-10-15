const angApp = angular.module('angApp', ['ngRoute']);

// configure our routes
angApp.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'main.html',
	})
	.when('/user', {
		templateUrl : 'user.html',
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
		controller: 'customerCtrl',
	})
	.when('/edit_customer/:id', {
		templateUrl: 'customer_form.html',
		controller: 'customerCtrl',
	})
	.when('/settings', {
		templateUrl : 'settings.html',
	})
	.when('/only', {
		templateUrl : 'request_only.html',
	});
});

angApp.controller('mainCtrl', function($scope, $window, $http) {
	$scope.$on('$viewContentLoaded', function() {
		checkTechnicians();
		checkRequests();

		let booleanCheck = false;

		$scope.semester = Lockr.get('settings').semester;		
		$scope.session = Lockr.get('session');		
		
		$scope.studentType = 'student';
		
		$scope.lastSeq = getLastSequence($scope.requests);
		$scope.ticketNumber = getNextSeq($scope.requests);

		$scope.studentNumbers = [];
		$scope.emails = [];
		
		$scope.satisfactionLevel = SATISFACTION;
		$scope.satisfaction = $scope.satisfactionLevel[1].value;
		$scope.categories = CATS;
		$scope.category = $scope.categories[0].value;
		$scope.colorOptions = COLORS;
		$scope.colorDevice = $scope.colorOptions[0].value;
		$scope.osOptions = OS;
		$scope.operatingSystem = $scope.osOptions[7].value;
		
		$scope.regex = '[0-9]{9}'; // Regex Padrao:

		//Check customers:
		$scope.customers = Lockr.get('customers');
		booleanCheck = ($scope.customers != undefined && $scope.customers.length > 0);
		$scope.customer = booleanCheck ? $scope.customers[0] : {};
		
		//Check Technicians:
		$scope.technicians = Lockr.get('technicians');
		booleanCheck = ($scope.technicians != undefined && $scope.technicians.length > 0);
		$scope.technician = booleanCheck ? $scope.technicians[0] : {};
		
		//Check Requests:
		$scope.requests = Lockr.get('requests');
		booleanCheck = ($scope.requests != undefined && $scope.requests.length > 0);
		$scope.request = booleanCheck ? $scope.requests[0] : {};
	});
	
	$scope.logout = function(){
		Lockr.set('session', {});
		window.location.href = '../index.html';
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

	$scope.saveEntity = function(x, entity){
		Lockr.sadd(entity, x);
		//
		new Noty({
            text: entity + ' saved successfully!',
			type: 'success',
			timeout: 3000,
		}).on('onClose', function() {
			$scope.back();
		}).show();
	};

	$scope.editEntity = function(id, x, entity){
		updateSQL(entity, id, x);
		//
		new Noty({
            text: entity + ' updated successfully!',
			type: 'success',
			timeout: 3000,
		}).on('onClose', function() {
			$scope.back();
		}).show();
	};

	$scope.deleteEntity = function(id, entity){
		deleteSQL(entity, id);
		//
		new Noty({
            text: entity + ' deleted successfully!',
			type: 'success',
			timeout: 3000,
		}).on('onClose', function() {
			//$scope.back();
			location.reload();
		}).show();
	};

	$scope.viewEntity = function(id){

	};

	//Helpers:
	$scope.isLogged = function(){
		return Lockr.get('session') != {};
	};

	$scope.isOnline = function(){
		return navigator.onLine;
	};

	$scope.capitalize = function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	$scope.back = function(){
		$window.history.back();
	};
});


angApp.controller('settingsCtrl', function($scope, $window) {
	
});

angApp.controller('userCtrl', function($scope, $window) {
	
});

angApp.controller('formUserCtrl', function($scope, $window){

});
/*
	

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
	*/



/*
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
	 */



/*
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
	 */



/*
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
	*/
//EXTRA:


/*
	
	/*
	for (var i = 0; i < $scope.customers.length; i++) {
		$scope.studentNumbers.push($scope.customers[i].studentNumber);
		$scope.emails.push($scope.customers[i].emailAddress);
	}
	*/
	/*
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
	*/


/*
	$scope.$on('$viewContentLoaded', function() {
		$("#studentNumber").mask('000000000');
		$("#phoneNumber").mask('(000)000-0000');

	    for (var i = 0; i < $scope.customers.length; i++) {
	    	if($scope.customers[i].studentNumber != 'N/A')
	        	$scope.studentNumbers.push($scope.customers[i].studentNumber);
	        $scope.emails.push($scope.customers[i].emailAddress);
	    }
	});

	

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
	*/


/*
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
	*/
var admin = require("firebase-admin");
var serviceAccount = require("./helpdesk-email-firebase-adminsdk-pmw1w-0206e5e214.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://helpdesk-email.firebaseio.com"
});

// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', ['ngRoute']);
var semester = getData('settings').value;
var session = getSession();

function goBack(){
	window.history.back();
}

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
	$scope.$on('$viewContentLoaded', function() {
		$scope.semester = semester;
	});

	$scope.save = function() {
		setSemester({label: 'semester', value: $scope.semester});
		$.alert({
		    title: 'Alert!',
		    content: 'Data saved with success!',
		    buttons: {
        		ok: function(){
					semester = getData('settings').value;
					$window.location.href = '#!/main';
            	
        		},
        	}
		});
	};
});

scotchApp.controller('loginController', function($scope, $window) {
	$scope.$on('$viewContentLoaded', function() {
		$scope.semester = semester;
	});
	
	$scope.user = {};

	$scope.sendLogin = function() {
		var logged = login($scope.user.username, md5($scope.user.password));
		if(logged != false) {
			setSession(logged);
			session = getSession();  
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
		$scope.requests = [];
		$scope.session = session;
		$scope.semester = semester;
		//Get Technicians:
		checkTechnicians();
		checkRequests();
	});
	/*
	$scope.logout = function(){
		$.confirm({
		   	title: 'Logout?',
		    content: 'You will be automatically logged out in 10 seconds.',
		    autoClose: 'logoutUser|10000',
		    type: 'yellow',
		    buttons: {
		        logoutUser: {
		            text: 'logout myself',
		            action: function () {
		                setSession('user',{});
						$window.location.href = '#!/';
		            }
		        },
		        cancel: function () {
		        }
		    }
		});
	}

	$scope.bug = function(){
		sendEmail("Report a bug here!", 'bug');
	};

	$scope.addon = function(){
		sendEmail("Suggest any Additional Tool!", 'Addon');
	};
	*/
	
	$scope.about = function(){
		new Noty({
			text: 'Developed by Erik Moline and Daniel Farias',
		}).show();
	};
});

scotchApp.controller('releaseController', function($scope, $window) {
	$scope.$on('$viewContentLoaded', function() {
		$scope.semester = semester;
		$scope.satisfactionLevel = SATISFACTION;
		$scope.satisfaction = $scope.satisfactionLevel[1].value;
		
	    var temp = getData('requests');
	    
	    if(temp != undefined && temp.length > 0){
	    	$scope.requests = temp;
	    	$scope.request = temp[0].id;
    	}else{
    		$.confirm({
			    title: 'No requests!',
			    content: 'No Open requests!',
			    type: 'red',
			    typeAnimated: true,
			    onDestroy: function(){
			    	$window.location.href = '#!/main';	
			    }
			});
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

	$scope.goAdd = function(){
		saveData('target','#!/intake');
	}

	$scope.$on('$viewContentLoaded', function() {
		$('#ticketNumber').mask('000-S');

		var requests = getData('requests');
		$scope.semester = semester;

		$scope.lastSeq = getLastSequence(requests);
		$scope.ticketNumber = getNextSeq(requests);

		$scope.customers = getData('customers');$scope.customer = $scope.customers[0];
		$scope.technicians = getData('technicians');$scope.technician = $scope.technicians[0].username;
		$scope.categories = CATS;$scope.category = $scope.categories[0].value;
		$scope.colorOptions = COLORS;$scope.colorDevice = $scope.colorOptions[0].value;
		$scope.osOptions = OS;$scope.operatingSystem = $scope.osOptions[7].value;
	});

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
	$scope.goAdd = function(){
		saveData('target','#!/only');
	}

	$scope.$on('$viewContentLoaded', function() {
		$('#ticketNumber').mask('000-S');

		var requests = getData('requests');
		$scope.semester = semester;

		$scope.lastSeq = getLastSequence(requests);
		$scope.ticketNumber = getNextSeq(requests);

		$scope.customers = getData('customers');$scope.customer = $scope.customers[0];
		$scope.technicians = getData('technicians');$scope.technician = $scope.technicians[0].username;
		$scope.categories = CATS;$scope.category = $scope.categories[0].value;
	});
	
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
		$scope.semester = semester;
		$scope.session = session;
		$scope.requests = getData('storedRequests');

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
	$scope.$on('$viewContentLoaded', function() {
		$('#phoneNumber').mask('(000)000-0000');
        $('#studentNumber').mask('000000000');
        
		var customers = getData('customers');
		$scope.customers = customers;
		$scope.semester = semester;
	    $scope.studentNumbers = [];
	    $scope.emails = [];

	    for (var i = 0; i < customers.length; i++) {
	        $scope.studentNumbers.push(customers[i].studentNumber);
	        $scope.emails.push(customers[i].emailAddress);
	    }
	});

	$scope.goAdd = function(){
		saveData('target','#!/customer');
	}

	$scope.capitalize = capitalize;

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
		//alert(getData('target'));
		$("#studentNumber").mask('000000000');
		$("#phoneNumber").mask('(000)000-0000');

		var customers = getData('customers');

		$scope.studentType = 'student';
		$scope.semester = semester;
	    $scope.studentNumbers = [];
	    $scope.emails = [];
	    $scope.regex = '[0-9]{9}'; // Regex Padrao:
	    
	    for (var i = 0; i < customers.length; i++) {
	    	if(customers[i].studentNumber != 'N/A')
	        	$scope.studentNumbers.push(customers[i].studentNumber);
	        $scope.emails.push(customers[i].emailAddress);
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
		if(session.role == "admin")
			$scope.users = getData('users'); 
		else
			$scope.users = [session];
		$scope.semester = getSemester();	
	});
	
	$scope.capitalize = capitalize;

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
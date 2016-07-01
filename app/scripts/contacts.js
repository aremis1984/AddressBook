'use strict';

angular.module('addressBook.contacts', ['ngRoute', 'ngDialog'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'templates/contacts.html',
    controller: 'ContactsCtrl'
  });
}])

//contacts controller
.controller('ContactsCtrl', ['$scope', '$http', '$location', '$anchorScroll', 'ngDialog', function($scope, $http, $location, $anchorScroll, ngDialog) {

	var contacts = angular.fromJson(window.localStorage['contacts'] || '[]');
    //localsotarege json
	function persist() {
	  	window.localStorage['contacts'] = angular.toJson(contacts);
	};

	$scope.contacts = contacts;

	//obtain country list from node module
    $http.get('/api/country')
    .success(function(data) {
       $scope.countries = data;
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });


	//show and hide add Form
	$scope.showAddForm = function(){
		ngDialog.open({ template: 'templates/popupTmpl.html', controller:'ContactsCtrl', className: 'ngdialog-theme-default' });
	} 

	//validate and add/update values
	$scope.addFormSubmit = function(){

		if($scope.name == null || $scope.lastname == null || $scope.email == null || $scope.country == null){
			alert("ERROR. You must fill all fields.");
		}else if(!validate($scope.email)){
			alert("Enter a valid email (example@example.com)");
		}else{	
			var name = $scope.name;
			var lastname = $scope.lastname;
			var email = $scope.email;
			var country = $scope.country;

			var patron = /^[a-zA-Z\s]*$/;
			if(name.search(patron) || lastname.search(patron)){
			  	alert("ERROR. For name and lastname enter only leters.");
			    return false;
			}  

			//checking if it's a new contact or we are editing
			if($scope.id){ 
				var id = $scope.id; 
				var edit = true;
			}else { 
				var id = new Date().getTime().toString(); 
			}

			//build the object
			var contact = {
				id: id,
			    name: name,
				lastname: lastname,
				email: email,
				country: country
			};

			if(edit){
				for(var i = 0; i < contacts.length; i++){
					if(contacts[i].id == contact.id){
						contacts[i] = contact;
						persist();
					}
				}
			}else{
				contacts.push(contact);
			}

			//persist data in localstorage
			persist();			
			location.reload(); 
		}		
	}

	//remove a contact from localstorage
	$scope.removeContact = function(contact){
		if(confirm("Are you sure you want to remove this contact?")){
			for (var i = 0; i < contacts.length; i++) {
		        if (contacts[i].id === contact.id) {
		          contacts.splice(i, 1);
		          persist();
		        }
	    	}
		}	
	}

	//show and hide edit Form
	$scope.showEditForm = function(contact){
		ngDialog.open({ template: 'templates/popupTmpl.html',  scope: $scope, controller:'ContactsCtrl', className: 'ngdialog-theme-default' });
		$scope.id = contact.id;
		$scope.name = contact.name;
		$scope.lastname = contact.lastname;
		$scope.email = contact.email;
		$scope.country = contact.country;
	}

	function validateEmail(email) {
	  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	  return re.test(email);
	}

	function validate(email) {
	 
	  if (!validateEmail(email)) {
	    return false;
	  }
	  return true;
	}


}]);	
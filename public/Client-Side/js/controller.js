var app = angular.module("AltranWebApp", ["ngRoute", "ngCookies"])
	.service('Global', function () {
	return {};
});

app.config(function ($routeProvider) {
	$routeProvider
		.when("/", { templateUrl: 'partials/login.html', controller: 'loginController' })
		.when("/allProjects", { templateUrl: 'partials/allProjects.html', controller: 'allProjectsController' })
		.when("/inTimeProjects", { templateUrl: 'partials/inTimeProjects.html', controller: 'inTimeProjectsController' })
		.when("/form/:ID", { templateUrl: 'partials/form.html', controller: 'formController' })
		.when("/mail/:ID", { templateUrl: 'partials/mail.html', controller: 'mailController' })
		.when("/test", { templateUrl: 'partials/test.html', controller: 'testController' })
		.when("/parameters/:Id", { templateUrl: 'partials/parameters.html', controller: 'parametersController' })
		.when("/parameters/:Id1/:Id2", { templateUrl: 'partials/parameters.html', controller: 'parametersController2' });
});

app.run(function ($rootScope, $cookies, $location) {
	$rootScope.logout = function () {
		$cookies.remove("userid");
		$cookies.remove("username");
		$cookies.remove("email");

		$('.drawer').drawer('close');

		$location.path("");
	};
});


app.controller('rootController', function ($scope, Global) {
	$scope.reloadPage = function () { alert("LEL"); }
	$scope.variavelteste = "G";

	$scope.Global = Global;
	$scope.Global.buttonstyle = "";

});

app.controller('loginController', function ($scope, $rootScope, $location, $routeParams, $timeout, $cookies, Global) {
	$scope.Global = Global;
	$scope.Global.buttonstyle = "width: 0px; height: 0px; margin-top: -9999px;";

	$scope.login = function () {
		var username = document.getElementById("login_username").value;
		var password = document.getElementById("login_password").value;

		var apiurl = "http://altran.sytes.net/login";
		var passwordhash = CryptoJS.MD5(password).toString();
	
		$.ajax({
		  url:apiurl,
		  type:"POST",
		  data: JSON.stringify({name : username, pass : passwordhash}),
		  contentType:"application/json; charset=utf-8",
		  success: function(code, textStatus){
			if(code == 200)
			{
				var apiurl2 = 'http://altran.sytes.net/user/"' + username + '"' ;

				$.get(apiurl2).then(function (response) {
					var data = response[0];
					
					if (data != undefined || data != null) {
						
						var now = new Date();
						var exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
		
						$cookies.put("userid", data.Id, { expires: exp });
						$cookies.put("username", username, { expires: exp });
						$cookies.put("email", data.Email, { expires: exp });
		
						$scope.Global.username = username;
						$scope.Global.email = data.Email;
						
						if($scope.Global.imgLink != "")
							$scope.Global.imgLink = "background-image: url('"+ data.Image_Link +"');";
						else
							$scope.Global.imgLink = "";
							
						$location.path("allProjects");
		
						$timeout(function () {
							$scope.currentPath = $location.path();
						}, 0);
					}
					else {
						alert("Falha ao efetuar Login.");
					}
			
				});
			}
		  },
		   error: function(jqXHR, textStatus, errorThrown) {
                if(jqXHR.status == 500)
				{
					alert("Erro ao efetuar Login.");
				}
				else if(jqXHR.status == 666)
				{
					alert("Erro da base de dados.");
				}
          }
		});
	}

	if ($cookies.get("userid") != undefined || $cookies.get("userid") != null) {
		var uname = $cookies.get("username");
		var email = $cookies.get("email");

		$scope.Global.username = uname.toUpperCase();
		$scope.Global.email = email;
		$scope.Global.fLetter = uname.charAt(0);

		$location.path("allProjects");
	}

});

app.controller('allProjectsController', function ($scope, $routeParams, $cookies, $location, Global) {
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";

	$('.drawer').drawer('close');

	var apiurl = "http://altran.sytes.net/projects/" + $cookies.get("userid");

	$.get(apiurl).then(function (response) {
		console.log(response);
		
		for(var i=0; i < $scope.projectos.length; i++)
		{
			$scope.projectos[i].day = $scope.projectos[i].date.substring(0, 2); 
		}
		
		$scope.$apply(function () {
			$scope.projectos = response;
		});

	});

	$scope.openProject = function (id) {
		var goTo = "form/" + id + "/";
		$location.path(goTo);
	}
});

app.controller('inTimeProjectsController', function ($scope, $routeParams, $cookies, $location, Global) {
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";

	$('.drawer').drawer('close');

	var apiurl = "http://altran.sytes.net/unProjects/" + $cookies.get("userid"); //TODO
	
	console.log(apiurl);
	
	$.get(apiurl).then(function (response) {
		console.log(response);

		$scope.$apply(function () {
			$scope.projectos = response;
		});

	});

	$scope.openProject = function (id) {
		var goTo = "form/" + id + "/";
		$location.path(goTo);
	}
});

app.controller('mailController', function ($scope, $http, $routeParams, $cookies, Global) {
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";
	$scope.result = 'hidden';
    $scope.resultMessage;
    $scope.formData;
    $scope.submitButtonDisabled = false;
    $scope.submitted = false; 
    $scope.send_email = function(contactform) {
        $scope.submitted = true;
        $scope.submitButtonDisabled = true;
        if (contactform.$valid) {
            $http({
                method  : 'POST',
                url     : '/php/send_email.php',
                data    : $.param($scope.formData),  //param method from jQuery
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  //set the headers so angular passing info as form data (not request payload)
            }).success(function(data){
				alert('oi');
                console.log(data);
                if (data.success) { //success comes from the return json object
                    $scope.submitButtonDisabled = true;
                    $scope.resultMessage = data.message;
                    $scope.result='bg-success';
                } else {
                    $scope.submitButtonDisabled = false;
                    $scope.resultMessage = data.message;
                    $scope.result='bg-danger';
                }
            });
        } else {
			alert('oi');
            $scope.submitButtonDisabled = false;
            $scope.resultMessage = 'Failed <img src="http://www.chaosm.net/blog/wp-includes/images/smilies/icon_sad.gif" alt=":(" class="wp-smiley">  Please fill out all the fields.';
            $scope.result='bg-danger';
        }
    }
});

app.controller('formController', function ($scope, $http, $routeParams, $cookies, Global) {
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";

	$('.drawer').drawer('close');

	var apiurl = "http://altran.sytes.net/project/" + $routeParams.ID;
	$.get(apiurl).then(function (response) {
		var data = response[0];
		console.log(data);
		$scope.$apply(function () {
			$scope.project = data;
		});
	});
	apiurl = "http://altran.sytes.net/questions/" + $routeParams.ID;

	$.get(apiurl).then(function (response) {
		var data = response;

		var json = [];
		for (var i = 0; i < data.length; i++) {
			var temp = {};
			temp["question_id"] = data[i].Question_Id;
			temp["value"] = 0;
			temp["description"] = data[i].Description;
			temp["comments"] = "";
			json.push(temp);
		}

		$scope.$apply(function () {
			$scope.questions = json;
		});
	});

	function allQuestionsAnswered() {
		for (var i = 0; i < $scope.questions.length; i++) {
			if ($scope.questions[i].value == 0) {
				return false;
			}
			if($scope.questions[i].value > 2 && $scope.questions[i].comments != '') {
				alert($scope.questions[i].value);
				return false;
			}
		}
		return true;
	}

	$scope.submitForm = function (id) {
		if (allQuestionsAnswered()) {
			delete $scope.validationFailed;
			// code to go to the next step here
		} else {
			
			$scope.validationFailed = true;
			return false;
		}
		
		
		console.log("posting data....");
		var formData = $scope.questions;
		var json = {
			assessement_id: id,
			answers: []
		};
		for (var i = 0; i < formData.length; i++) {
			var temp = {};
			temp["id_pergunta"] = formData[i].question_id;
			temp["value"] = formData[i].value;
			temp["description"] = formData[i].comments;
			json.answers.push(temp);
		}
		var apiurl = "http://altran.sytes.net/answer/";
		$http({
	        url: apiurl,
	        method: 'POST',
	        data: json,
			dataType: "json"
		}).success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
		}).error(function(data, status, headers, config) {
    		// called asynchronously if an error occurs
    		// or server returns response with an error status.
		});
	}
});


app.controller('testController', function ($scope, $routeParams, $window) {
	$('.drawer').drawer('close');
});

app.controller('parametersController', function ($scope, $routeParams, $window) {
	//window.location.reload();
	$scope.Id = $routeParams.Id;
});

app.controller('parametersController2', function ($scope, $routeParams) {
	$scope.Id = $routeParams.Id2;
});





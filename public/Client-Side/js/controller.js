var app = angular.module("AltranWebApp", ["ngRoute", "ngCookies"])
	.service('Global', function () {
	return {};
});

app.factory('AlertService', function () {
	var success = {},
		error = {},
		alert = false;
	return {
		getSuccess: function () {
			return success;
		},
		setSuccess: function (value) {
			success = value;
			alert = true;
		},
		getError: function () {
			return error;
		},
		setError: function (value) {
			error = value;
			alert = true;
		},
		reset: function () {
			success = {};
			error = {};
			alert = false;
		},
		hasAlert: function () {
			return alert;
		}
	}
});

app.config(function ($routeProvider) {
	$routeProvider
		.when("/", { templateUrl: 'partials/login.html', controller: 'loginController' })
		.when("/allProjects", { templateUrl: 'partials/allProjects.html', controller: 'allProjectsController' })
		.when("/inTimeProjects", { templateUrl: 'partials/inTimeProjects.html', controller: 'inTimeProjectsController' })
		.when("/form/:ID", { templateUrl: 'partials/form.html', controller: 'formController' })
		.when("/mail/:ID", { templateUrl: 'partials/mail.html', controller: 'mailController' })
		.when("/detailsProject/:ID", { templateUrl: 'partials/detailsProject.html', controller: 'detailsProjectController' })
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

	$('.drawer').drawer('close');
	$scope.loginfailed = 0;
	$scope.loginerrormessage = "";

	$scope.login = function () {
		$scope.loginfailed = 0;
		$scope.loginerrormessage = "";

		var username = document.getElementById("login_username").value;
		var password = document.getElementById("login_password").value;

		var apiurl = "http://altran.sytes.net/login";
		var passwordhash = CryptoJS.MD5(password).toString();

		$.ajax({
			url: apiurl,
			type: "POST",
			data: JSON.stringify({ name: username, pass: passwordhash }),
			contentType: "application/json; charset=utf-8",
			success: function (code, textStatus) {
				//console.log(code + " " + textStatus);
				if (code == 200) {
					var apiurl2 = 'http://altran.sytes.net/user/"' + username + '"';

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

							if ($scope.Global.imgLink != "") {
								$scope.Global.imgLink = "background-image: url('" + data.Image_Link + "');";
								$cookies.put("urlLink", "background-image: url('" + data.Image_Link + "');", { expires: exp });
							}
							else {
								$scope.Global.imgLink = "";
								$cookies.put("urlLink", "", { expires: exp });
							}

							$location.path("allProjects");

							$timeout(function () {
								$scope.currentPath = $location.path();
							}, 0);
						}
						else {
							$scope.$apply(function () {
								$scope.loginfailed = 1;
								$scope.loginerrormessage = "Wrong credentials!";
							});
						}

					});
				}
				else {
					$scope.$apply(function () {
						$scope.loginfailed = 1;
						$scope.loginerrormessage = "Unsuccessful Login";
					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 500) {
					alert("Erro ao efetuar Login.");
				}
				else if (jqXHR.status == 666) {
					alert("Erro da base de dados.");
				}
				$scope.$apply(function () {
					$scope.loginfailed = 2;
					$scope.loginerrormessage = "Server Down!";
				});


			}
		});
	}

	if ($cookies.get("userid") != undefined || $cookies.get("userid") != null) {
		var uname = $cookies.get("username");
		var email = $cookies.get("email");
		var uLink = $cookies.get("urlLink");

		$scope.Global.username = uname.toUpperCase();
		$scope.Global.email = email;
		$scope.Global.imgLink = uLink;
		$scope.Global.fLetter = uname.charAt(0);

		$location.path("allProjects");
	}

});

app.controller('allProjectsController', function ($scope, $routeParams, $cookies, $location, AlertService, Global) {
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";

	$('.drawer').drawer('close');
	
	$scope.successmsg = 0;
	
	if (AlertService.hasAlert()) {
	  $scope.success = AlertService.getSuccess();
	  $scope.successmsg = 1;
	  AlertService.reset();
	  
	  var succMsg = setInterval(function () {
			$scope.$apply(function () {
				$scope.successmsg = 0;
				$scope.formerrormessage = "";
			});
			clearInterval(succMsg);
		}, 5000);
	}

	var apiurl = "http://altran.sytes.net/projects/" + $cookies.get("userid");
	
	

	$.get(apiurl).then(function (response) {
		var today = new Date();
		
		
		for (var i = 0; i < response.length; i++) {
			var projectDateSplit = response[i].date.split("-"); 
			
			response[i].day = response[i].date.substring(0, 2);
			
			if(response[i].day.charAt(1) == "-")
			{
				response[i].day = "0" + response[i].day.charAt(0);
			}
			
			var date1 = new Date(today.getFullYear(),(today.getMonth()+1),today.getDate()); 
			var date2 = new Date(projectDateSplit[2],projectDateSplit[1],projectDateSplit[0]);
			var timeDiff = Math.abs(date2.getTime() - date1.getTime());
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
			
			if(response[i].Flag == 0 && diffDays > 30)
			{
				response[i].Flag = 2;
			}
			
			response[i].dateValue = parseInt(projectDateSplit[2])*100 + parseInt(projectDateSplit[1])*10 + parseInt(projectDateSplit[0])*1;
		}
		
		response.sort(function compare(a,b) {
			  if (a.dateValue < b.dateValue)
				return -1;
			  if (a.dateValue > b.dateValue)
				return 1;
			  return 0;
		});

		$scope.$apply(function () {
			$scope.projectos = response;
		});

	});

	$scope.openProject = function (id) {
		var goTo = "detailsProject/" + id + "/";
		$location.path(goTo);
	}

	if ($cookies.get("userid") != undefined || $cookies.get("userid") != null) {
		var uname = $cookies.get("username");
		var email = $cookies.get("email");
		var uLink = $cookies.get("urlLink");

		$scope.Global.username = uname.toUpperCase();
		$scope.Global.email = email;
		$scope.Global.imgLink = uLink;
		$scope.Global.fLetter = uname.charAt(0);

		$location.path("allProjects");
	}
});

app.controller('inTimeProjectsController', function ($scope, $routeParams, $cookies, $location, Global) {
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";

	$('.drawer').drawer('close');

	var apiurl = "http://altran.sytes.net/unProjects/" + $cookies.get("userid");
	
	$.get(apiurl).then(function (response) {

		for (var i = 0; i < response.length; i++) {
			var projectDateSplit = response[i].date.split("-"); 
			response[i].day = response[i].date.substring(0, 2);
			
			if(response[i].day.charAt(1) == "-")
			{
				response[i].day = "0" + response[i].day.charAt(0);
			}
			
			response[i].dateValue = parseInt(projectDateSplit[2])*100 + parseInt(projectDateSplit[1])*10 + parseInt(projectDateSplit[0])*1;
		}
		
		response.sort(function compare(a,b) {
			  if (a.dateValue < b.dateValue)
				return -1;
			  if (a.dateValue > b.dateValue)
				return 1;
			  return 0;
		});
		
		$scope.$apply(function () {
			$scope.projectos = response;
		});

	});

	$scope.openProject = function (id) {
		var goTo = "detailsProject/" + id + "/";
		$location.path(goTo);
	}

	if ($cookies.get("userid") != undefined || $cookies.get("userid") != null) {
		var uname = $cookies.get("username");
		var email = $cookies.get("email");
		var uLink = $cookies.get("urlLink");

		$scope.Global.username = uname.toUpperCase();
		$scope.Global.email = email;
		$scope.Global.imgLink = uLink;
		$scope.Global.fLetter = uname.charAt(0);
	}
});

app.controller('mailController', function ($scope, $http, $routeParams, $cookies, $location, AlertService, Global) {
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";

	$('.drawer').drawer('close');
	$scope.resultMessage;
    $scope.formData;
	var Email;
	var Representative;
	var apiurl = "http://altran.sytes.net/project/" + $routeParams.ID;
	$.get(apiurl).then(function (response) {
		var data = response[0];

		Email = data.Email;
		Representative = data.First_Name + ' ' + data.Last_Name;
	});

	$scope.result = 'hidden';
    $scope.submitButtonDisabled = false;
    $scope.submitted = false;
    $scope.send_email = function (contactform) {
        $scope.submitted = true;
        $scope.submitButtonDisabled = true;
		$scope.formData.Email = Email;
		$scope.formData.Representative = Representative;
		//console.log($scope.formData);
        if (contactform.$valid) {
            $http({
                method: 'POST',
                url: '/php/send_email.php',
                data: $.param($scope.formData),  //param method from jQuery
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  //set the headers so angular passing info as form data (not request payload)
            }).success(function (data) {

				$scope.submitButtonDisabled = true;
				$scope.resultMessage = data.message;
				$scope.result = 'bg-success';
				var goTo = "allProjects/";
				AlertService.setSuccess({ show: true, msg: ' Mail sent successfully!' });
				$location.path(goTo);
            });
        }
    }

	if ($cookies.get("userid") != undefined || $cookies.get("userid") != null) {
		var uname = $cookies.get("username");
		var email = $cookies.get("email");
		var uLink = $cookies.get("urlLink");

		$scope.Global.username = uname.toUpperCase();
		$scope.Global.email = email;
		$scope.Global.imgLink = uLink;
		$scope.Global.fLetter = uname.charAt(0);
	}
});

app.controller('formController', function ($scope, $http, $routeParams, $cookies, $location, AlertService, Global) {
	$scope.done = 0;
	$scope.formfailed = 0;
	$scope.formerrormessage = "";

	$('.drawer').drawer('close');

	var apiurl = "http://altran.sytes.net/project/" + $routeParams.ID;
	$.get(apiurl).then(function (response) {
		var data = response[0];
		//console.log(data);

		$scope.$apply(function () {
			$scope.project = data;
		});
	});

	var apiurl2 = "http://altran.sytes.net/questions/" + $routeParams.ID;
	$.get(apiurl2).then(function (response) {
		var data = response;

		var json = [];
		for (var i = 0; i < data.length; i++) {
			var temp = {};

			if (i > 0 && i < data.length - 1) //Serve para deixar os números das perguntas mais bonitas no CSS
			{
				if (i < 10) {
					temp["number"] = "0" + i;
				}
				else {
					temp["number"] = i;
				}
				temp["description"] = data[i].Description.split(".")[1];
			}
			else {
				temp["number"] = "#";
				temp["description"] = data[i].Description;
			}

			temp["question_id"] = data[i].Question_Id;
			temp["value"] = 0;
			temp["comments"] = "";
			json.push(temp);
		}

		$scope.$apply(function () {
			$scope.done = 1;
			$scope.questions = json;
		});
	});

	function allQuestionsAnswered() {
		for (var i = 0; i < $scope.questions.length; i++) {
			if ($scope.questions[i].value == 0) {
				return 1;
			}
			if ($scope.questions[i].value > 2 && $scope.questions[i].comments != '') {
				alert($scope.questions[i].value);
				return 2;
			}
		}
		return 0;
	}

	$scope.submitForm = function (id) {

		if (allQuestionsAnswered() == 0) {

			//console.log("posting data....");
			var formData = $scope.questions;
			var json = {
				assessment_Id: id,
				answers: []
			};

			for (var i = 0; i < formData.length; i++) {
				var temp = {};
				temp["id_pergunta"] = formData[i].question_id;
				temp["value"] = formData[i].value;
				temp["description"] = formData[i].comments;
				json.answers.push(temp);
			}

			//console.log(json);

			var apiurl3 = "http://altran.sytes.net/answer/";
			$http({
				url: apiurl3,
				method: 'POST',
				data: json,
				dataType: "json"
			}).success(function (data, status, headers, config) {
				var goTo = "allProjects/";
				AlertService.setSuccess({ show: true, msg: 'Form submitted successfully!' });
				$location.path(goTo);
				// this callback will be called asynchronously
				// when the response is available
			}).error(function (data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});

		} else if (allQuestionsAnswered() == 1) {
			$scope.formfailed = 1;
			$scope.formerrormessage = "Please answer to all questions!";

			var formerrortimer = setInterval(function () {
				$scope.$apply(function () {
					$scope.formfailed = 0;
					$scope.formerrormessage = "";
				});
				clearInterval(formerrortimer);
			}, 5000);

			return false;
		} else if (allQuestionsAnswered() == 2) {
			$scope.formfailed = 2;
			$scope.formerrormessage = "Incorrect Form submited!";

			var formerrortimer = setInterval(function () {
				$scope.$apply(function () {
					$scope.formfailed = 0;
					$scope.formerrormessage = "";
				});
				clearInterval(formerrortimer);
			}, 5000);

			return false;
		}
	}

	if ($cookies.get("userid") != undefined || $cookies.get("userid") != null) {
		var uname = $cookies.get("username");
		var email = $cookies.get("email");
		var uLink = $cookies.get("urlLink");

		$scope.Global.username = uname.toUpperCase();
		$scope.Global.email = email;
		$scope.Global.imgLink = uLink;
		$scope.Global.fLetter = uname.charAt(0);
	}
});


app.controller('detailsProjectController', function ($scope, $http, $location, $routeParams, $cookies, Global) {

	$scope.done = 0;
	$('.drawer').drawer('close');
	var today = new Date();

	var apiurl = "http://altran.sytes.net/project/" + $routeParams.ID;

	$.get(apiurl).then(function (response) {
		var data = response[0];
		
		var projectDateSplit = data.date.split("-"); 
		
		var date1 = new Date(today.getFullYear(),(today.getMonth()+1),today.getDate()); 
		var date2 = new Date(projectDateSplit[2],projectDateSplit[1],projectDateSplit[0]);
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
		
		if(data.Flag == 0 && diffDays > 30)
		{
			data.Flag = 2;
		}

		$scope.$apply(function () {
			$scope.project = data;
			$scope.done = 1;
		});
	});

	$scope.formReply = function (id) {
		var goTo = "form/" + id + "/";
		$location.path(goTo);
	}

	$scope.sendMail = function (id) {
		var goTo = "mail/" + id + "/";
		$location.path(goTo);
	}

	if ($cookies.get("userid") != undefined || $cookies.get("userid") != null) {
		var uname = $cookies.get("username");
		var email = $cookies.get("email");
		var uLink = $cookies.get("urlLink");

		$scope.Global.username = uname.toUpperCase();
		$scope.Global.email = email;
		$scope.Global.imgLink = uLink;
		$scope.Global.fLetter = uname.charAt(0);
	}

});






var app = angular.module("AltranWebApp",["ngRoute","ngCookies"])
.service('Global', function () {
  return {};
});

app.config( function($routeProvider) {
  $routeProvider
  .when("/", {templateUrl:'partials/login.html', controller:'loginController'})
  .when("/home", {templateUrl:'partials/home.html', controller:'homeController'})
  .when("/form", {templateUrl:'partials/form.html', controller:'formController'})
  .when("/parameters/:Id", {templateUrl: 'partials/parameters.html', controller: 'parametersController'})
  .when("/parameters/:Id1/:Id2", {templateUrl: 'partials/parameters.html', controller: 'parametersController2'});
});

app.run(function($rootScope,$cookies,$location) {
  $rootScope.logout = function() 
  {
    $cookies.remove("userid");
    $cookies.remove("username");
    $cookies.remove("email");

    $('.drawer').drawer('close');

    $location.path(""); 
  };
});


app.controller('rootController', function($scope,Global) {
  $scope.reloadPage = function(){alert("LEL");}
  $scope.variavelteste = "G";

  $scope.Global = Global;
  $scope.Global.buttonstyle = "";

});

app.controller('loginController', function($scope,$location,$routeParams,$timeout,$cookies,Global) {
  $scope.Global = Global;
  $scope.Global.buttonstyle = "width: 0px; height: 0px; margin-top: -9999px;";

  $scope.login = function(){
    var username = document.getElementById("login_username").value;
    var password = document.getElementById("login_password").value;

    var apiurl = "http://altran.sytes.net/user/" + '"' + username + '"';
    var passwordhash = CryptoJS.MD5(password).toString();

    $.get(apiurl).then( function(response)
    {
		var data = response[0];
		
		if(data != undefined || data != null)
		{
			var now = new Date();
			var exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());

			$cookies.put("userid", data.Id, {expires: exp});
			$cookies.put("username", username, {expires: exp});
			$cookies.put("email", data.Email, {expires: exp});

			$scope.Global.username = username;
			$scope.Global.email = data.Email;
			$scope.Global.fLetter = username.charAt(0);

			$location.path("home"); 
			$timeout(function () { 
				$scope.currentPath = $location.path();
			},0);
		}
		else
		{
			alert("Falha ao efetuar Login.");
		}
    });
  }

  if($cookies.get("userid") != undefined || $cookies.get("userid") != null)
  {	
    var uname = $cookies.get("username");
    var email = $cookies.get("email");

    $scope.Global.username = uname.toUpperCase();
    $scope.Global.email = email;
    $scope.Global.fLetter = uname.charAt(0);

    $location.path("home"); 
  }

});

app.controller('homeController', function($scope,$routeParams,$cookies,Global) {
 
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";

	var apiurl = "http://altran.sytes.net/projects/" + $cookies.get("userid");

	$.get(apiurl).then( function(response)
	{
		console.log(response);
		
		$scope.$apply(function () {
			$scope.projectos = response;
		});	

	});
});

app.controller('formController', function($scope,$routeParams,$cookies,Global) {
  $scope.Global = Global;
  $scope.Global.buttonstyle = "";
  
  $scope.formData = {};
  $scope.formData.question_1 = 0;
  $scope.formData.question_2 = 0;
  $scope.formData.question_3 = 0;
  $scope.formData.question_4 = 0;
  $scope.formData.question_5 = 0;
  $scope.formData.question_6 = 0;
  $scope.formData.question_7 = 0;
  $scope.formData.question_8 = 0;
  $scope.formData.question_9 = 0;
  $scope.formData.question_10 = 0;
  $scope.formData.question_11 = 0;
  $scope.formData.question_12 = 0;
  $scope.question_1_content = 'first';
  $scope.question_2_content = 'first';
  $scope.question_3_content = 'first';
  $scope.question_4_content = 'first';
  $scope.question_5_content = 'first';
  $scope.question_6_content = 'first';
  $scope.question_7_content = 'first';
  $scope.question_8_content = 'first';
  $scope.question_9_content = 'first';
  $scope.question_10_content = 'first';
  $scope.question_11_content = 'first';
});

app.controller('parametersController', function($scope,$routeParams,$window) {
  //window.location.reload();
  $scope.Id = $routeParams.Id;
});

app.controller('parametersController2', function($scope,$routeParams) {
  $scope.Id = $routeParams.Id2;
});





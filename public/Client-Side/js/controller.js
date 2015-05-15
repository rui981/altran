var app = angular.module("AltranWebApp",["ngRoute","ngCookies"])
.service('Global', function () {
  return {};
});

app.config( function($routeProvider) {
  $routeProvider
  .when("/", {templateUrl:'partials/login.html', controller:'loginController'})
  .when("/home", {templateUrl:'partials/home.html', controller:'homeController'})
  .when("/form/:ID", {templateUrl:'partials/form.html', controller:'formController'})
  .when("/test", {templateUrl:'partials/test.html', controller:'testController'})
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

app.controller('loginController', function($scope,$rootScope,$location,$routeParams,$timeout,$cookies,Global) {
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
			$scope.Global.imgLink = data.Image_Link;

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

app.controller('homeController', function($scope,$routeParams,$cookies,$location,Global) {
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";
	
	$('.drawer').drawer('close');

	var apiurl = "http://altran.sytes.net/projects/" + $cookies.get("userid");
	
	$.get(apiurl).then( function(response)
	{
		console.log(response);
		
		$scope.$apply(function () {
			$scope.projectos = response;
		});	

	});
	
	$scope.openProject = function(id){
		var goTo = "form/" + id + "/";
		$location.path(goTo); 
	}
	
	
});

app.controller('formController', function($scope,$routeParams,$cookies,Global) {
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";

	$('.drawer').drawer('close');

	var apiurl = "http://altran.sytes.net/questions/" + $routeParams.ID;
	var data;
	
	$.get(apiurl).then( function(response)
	{
		data = response;
		console.log(data);
		
		$scope.formData = {};

		var json=[];
		for(var i=0;i<data.length;i++)
		{
		  console.log(i);
		  var temp={};
		  temp["assessement_id"]=0;
		  temp["question_id"]=i;
		  temp["value"]=0;
		  temp["description"]=data[i].Description;
		  temp["comments"]="";
		  json.push(temp);
		}
		
		$scope.$apply(function () {
			$scope.questions = json;
		});	
		

		//console.log(json);

	});

	

	$scope.submitForm = function() {
		console.log("posting data....");
		var formData = $scope.questions;
		console.log(formData);
	};
});

app.controller('testController', function($scope,$routeParams,$window) {
	 $('.drawer').drawer('close');
});

app.controller('parametersController', function($scope,$routeParams,$window) {
  //window.location.reload();
  $scope.Id = $routeParams.Id;
});

app.controller('parametersController2', function($scope,$routeParams) {
  $scope.Id = $routeParams.Id2;
});





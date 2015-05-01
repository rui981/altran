var app = angular.module("AltranWebApp",["ngRoute","ngCookies"])
.service('Global', function () {
    return {};
});

app.config( function($routeProvider)
{
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


app.controller('rootController', function($scope,Global)
{
	$scope.reloadPage = function(){alert("LEL");}
	$scope.variavelteste = "G";
	
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";
	
});

app.controller('loginController', function($scope,$location,$routeParams,$timeout,$cookies,Global)
{
	$scope.Global = Global;
	$scope.Global.buttonstyle = "width: 0px; height: 0px; margin-top: -9999px;";
	
	$scope.login = function(){
		var username = document.getElementById("login_username").value;
		var password = document.getElementById("login_password").value;
		
		var apiurl = "http://altran.sytes.net/user/" + '"' + username + '"';
		// Enquanto falta MD5 na base de dados : var passwordhash = CryptoJS.MD5(password);
		var passwordhash = password;
		var canRedirect = false;
		
		$.get(apiurl).then( function(response)
		{
		  var data = response[0];
		  
		  if(data.pass == passwordhash)
		  {
			var now = new Date();
			var exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
			
			$cookies.put("userid", data.id, {expires: exp});
			$cookies.put("username", username, {expires: exp});
			$cookies.put("email", data.email, {expires: exp});
			
			$scope.Global.username = username;
			$scope.Global.email = data.email;
			$scope.Global.fLetter = username.charAt(0);
			
			$location.path("home"); 
			$timeout(function () { $scope.currentPath = $location.path();
			},0);
		  }
		  else
		  {
			alert("Password é diferente.");
		  }
		});
	}
	
	if($cookies.get("userid") != undefined || $cookies.get("userid") != null)
	{	
		console.log($cookies.get("userid"));
		var uname = $cookies.get("username");
		var email = $cookies.get("email");
		
		$scope.Global.username = uname.toUpperCase();
		$scope.Global.email = email;
		$scope.Global.fLetter = uname.charAt(0);
				
		$location.path("home"); 
	}

});

app.controller('homeController', function($scope,$routeParams,$cookies,Global)
{
	$scope.Global = Global;
	$scope.Global.buttonstyle = "";
	
	var apiurl = "http://altran.sytes.net/projects/" + $cookies.get("userid");

	$.get(apiurl).then( function(response)
	{
		$scope.$apply(function () {
			$scope.projectos = response;
        });	
	  
	});
});

app.controller('parametersController', function($scope,$routeParams,$window)
{
	//window.location.reload();
	$scope.Id = $routeParams.Id;
});

app.controller('parametersController2', function($scope,$routeParams)
{
	$scope.Id = $routeParams.Id2;
});





'use strict';

angular.module('TemplateEngine',[])
.controller('MainCtrl',['$scope','$http',function($scope,$http){	
	$scope.addImage = function  (argument) {
		// body...
		// console.log('Hello');
		$scope.uploadState = 'fileUpload';
		$scope.metadata.images.push(new File($scope.file.title,$scope.file.path,$scope.file.story));
	}
	var File = function(title,path,story){
		this.path = path;
		this.title = title;
		this.story = story;
	}
	$scope.file = {};
	$http.get('https://shreyaportfolio-sumant19.c9users.io/getMetadata').then(function(response){
		$scope.metadata =  response.data.data;
		$scope.titles = [];
		for ( var props in $scope.metadata){
			$scope.metadata[props].constructor !== [].constructor ? $scope.titles.push(props) : $scope;
		}
	});
	$scope.postMetadata = function(successCallback){
		// console.log($scope.metadata);
		$http.post('https://shreyaportfolio-sumant19.c9users.io/setMetadata',{data : $scope.metadata})
		.then(function(response){
			successCallback && successCallback();
			document.getElementById('iframe1').contentWindow.location.reload(true);

		})
	}

	$scope.uploadState = 'fileUpload';
	$scope.uploadFile = function(){
		$scope.uploadState = 'loading';
		var file = $('#imageFile').prop('files')[0];
		//console.log(file);
		var fd = new FormData()
		fd.append('file',file);
		$http.post(
			'https://shreyaportfolio-sumant19.c9users.io/upload',
			fd,
			{       
				transformRequest : angular.identity,         
                headers: {'Content-Type': undefined}
            }
            )
		.then(function(response){
			$scope.file.path = response.data.file;
			$scope.uploadState = 'story';
			//$scope.message = response.data;
		})
		
	}

	// $scope.addImage = function(){
	// 	//console.log($scope.metadata);
	// 	debugger;
		
	// }



	var deleteImageFileProperty = undefined;
	var fileIndex = undefined;
	$scope.deleteWarning = function(image,index){
		deleteImageFileProperty = image;
		fileIndex = index;
		$('#deleteImageFileModal').modal('show')
	}

	$scope.deleteFile = function(){
		// console.log(deleteImageFileProperty);
		// console.log(fileIndex);
		$http.post("https://shreyaportfolio-sumant19.c9users.io/delete",
			{
				data : deleteImageFileProperty
			},{ headers: {
    			'Content-Type': 'application/x-www-form-urlencoded'
  			}}
  		)
		.then(function(response){
			$scope.metadata.images = $scope.metadata.images.filter(
				function(image){
					return image.path !== deleteImageFileProperty.path;
				}) 
			$scope.postMetadata(function(){
				$('#deleteImageFileModal').modal('hide');
			});
		},function(error){
			console.log(error);
		});
	};
	
	$scope.gitPush = function(){
		$http.get("https://shreyaportfolio-sumant19.c9users.io/gitPush").
		then(function(response){
			console.log(response);
		},function(errorResponse){
			console.log(errorResponse);
		});
	};
}]);
// .directive('MetadataTypeInputComponent',[function(){
// 	return{
// 		templateUrl : '../partials/metadataTypeInputComponent.html'
// 	}
// }])



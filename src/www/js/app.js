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
	$http.get('http://localhost:3000/json/siteMetadata.json').then(function(response){
		$scope.metadata =  response.data.data;
		$scope.titles = [];
		for ( var props in $scope.metadata){
			$scope.metadata[props].constructor !== [].constructor ? $scope.titles.push(props) : $scope;
		}
	});
	$scope.postMetadata = function(successCallback){
		// console.log($scope.metadata);
		$http.post('http://localhost:4000/',{data : $scope.metadata})
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
			'http://localhost:4000/upload',
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
		$http.post("http://localhost:4000/delete",
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
		})
	}
}])
// .directive('MetadataTypeInputComponent',[function(){
// 	return{
// 		templateUrl : '../partials/metadataTypeInputComponent.html'
// 	}
// }])



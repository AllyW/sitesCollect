/**
 * Created by liwang on 10/31/15.
 */
(function(){
	var LiApp = angular.module('LiApp', ['stickerModule']);
	var mainController = function ($rootScope, $scope) {
        $rootScope.rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        $scope.imgPhoto = '';
        $scope.imgError = '';

		var photoFReader = new FileReader();
		photoFReader.onload = function (oFREvent) {
			$scope.imgPhoto = oFREvent.target.result;
            $scope.showStartOver = true;
            $scope.imgError = '';
			if(!$scope.$$phase) $scope.$apply();
        };
		$scope.loadPhotoFile = function(){
			if (document.getElementById("i-uploadPhoto").files.length === 0) { return; }
			var photoFile = document.getElementById("i-uploadPhoto").files[0];
			if (!$rootScope.rFilter.test(photoFile.type)) {
                $scope.imgError = "You must select a valid image file!";
                if(!$scope.$$phase) $scope.$apply();
                return;
            }
			photoFReader.readAsDataURL(photoFile);
		};

        $scope.clearAll = function(){
            $scope.imgPhoto = '';
            $('#drop-item').siblings().remove();
            if(!$scope.$$phase) $scope.$apply();
            $rootScope.$broadcast("root:clearSticker");
		};

        $('div').on("dragstart",".c-drag", function(e) {
           //debugger;
            var a = $(this).attr('id');
            if(a.indexOf('drag-item') != -1) {
                e.originalEvent.dataTransfer.setData('text', a);
                e.originalEvent.dataTransfer.effectAllowed = 'move';
            }
        });

        $('div').on("dragover", ".c-drop", function(e){
            //debugger;
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'move';

        });

        $('div').on("drop", ".c-drop", function(e){
            //debugger;
            e.preventDefault();
            e.stopPropagation();
            if(e.target.id.indexOf('drop-item') != -1) {
                var data = e.originalEvent.dataTransfer.getData("text");
                var id = e.target.id;
                var offsetx = $('#'+id).parent().offset().left;
                var offsety = $('#'+id).parent().offset().top;

                var x = e.originalEvent.pageX - offsetx;
                var y = e.originalEvent.pageY - offsety;

                $('#'+data).css({ position: 'absolute'});
                $('#'+data).css({ top: y + 'px' });
                $('#'+data).css({ left: x + 'px' });
                $('#'+data).attr({ draggable: false});
                $('#'+data).removeClass('c-drag');
                $('#'+data).clone().appendTo($('#'+id).parent());
                $rootScope.$broadcast("root:clearStickerById", data);
            }
        });
	};
  LiApp.controller('mainController', mainController);

})();

/**
 * Created by liwang on 11/1/15.
 * Referenced to http://jsfiddle.net/alexsuch/RLQhh/
 */
(function(){
    var stickerModuler = angular.module('stickerModule', ['lvl.services']);
    stickerModuler.controller('stickerController', function ($rootScope, $scope, uuid) {
        $scope.imgSticker=[];
        $scope.tempUrl ='';
        $scope.tempTitle = '';
        $scope.showModal = false;
        $scope.isDeleteVisible = false;
        $scope.fileError = 'Please pick an image file';
        $scope.titleError = 'Please input sticker title (required)';
        $scope.toggleModal = function(){
            $scope.fileError = 'Please pick an image file';
            $scope.titleError = 'Please input sticker title (required)';
            $scope.showModal = !$scope.showModal;
        };

        var stickerFReader = new FileReader();
		stickerFReader.onload = function (oFREvent) {
            $scope.tempUrl = oFREvent.target.result;
            $scope.fileError = '';
            if(!$scope.$$phase) $scope.$apply();
        };

        $scope.loadStickerFile = function(){
            if ($('#i-stickerphoto').get(0).files.length === 0) { return; }
			var photoFile = $('#i-stickerphoto').get(0).files[0];
			if (!$rootScope.rFilter.test(photoFile.type)) {
                $scope.fileError = "You must select a valid image file!";
                if(!$scope.$$phase) $scope.$apply();
                return;
            }
			stickerFReader.readAsDataURL(photoFile);
        }

        $scope.updateTitle = function(){
            var $title = $('#i-stickertitle');
            $scope.tempTitle =  $title.val();
            if(!$scope.tempTitle){
                $scope.titleError = 'Please input sticker title (required)';
            }else{
                $scope.titleError = '';
            }
        }

        $scope.stickerSubmit = function(){
            if(!$scope.tempUrl || !$scope.tempTitle) return;
            $scope.imgSticker.push({'title': $scope.tempTitle, 'imgSrc': $scope.tempUrl, 'id':'drag-item'+uuid.new()});
            $scope.tempUrl ='';
            $scope.tempTitle = '';
            $scope.showModal = !$scope.showModal;
            var $title = $('#i-stickertitle');
            $title.closest('form').get(0).reset();
        }

        $scope.showDelete = function(){
            $scope.isDeleteVisible = true;
        }
        $scope.hideDelete = function(){
            $scope.isDeleteVisible = false;
        }
        $scope.removeItembyId = function(id){
            //debugger;
            for (item in $scope.imgSticker){
                if ($scope.imgSticker[item].id == id){
                    $scope.imgSticker.splice(item, 1);
                }
            }
            if(!$scope.$$phase) $scope.$apply();
        }

        $rootScope.$on("root:clearSticker", function(){
            $scope.imgSticker=[];
            if(!$scope.$$phase) $scope.$apply();
        });

        $rootScope.$on("root:clearStickerById", function(event, id){
            //debugger;
            $scope.removeItembyId(id);
        });


    });
    stickerModuler.directive('modal', function () {
        return {
            template:
            '<div class="modal fade">' +
                '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                            '<h4 class="modal-title">{{ title }}</h4>' +
                        '</div>' +
                        '<div class="modal-body" ng-transclude></div>' +
                    '</div>' +
                '</div>' +
            '</div>',
            restrict: 'E',
            transclude: true,
            replace:true,
            scope:true,
            link: function postLink(scope, element, attrs) {
                scope.title = attrs.title;

                scope.$watch(attrs.visible, function(value){
                    if(value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });
                $(element).on('shown.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = true;
                    });
                });
                $(element).on('hidden.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    });
})();
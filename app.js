(function(){

'use strict';	

angular.module('menuList', [])
.controller('menuListing', menuListingController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItems);


menuListingController.$inject = ['MenuSearchService'];
function menuListingController(MenuSearchService){
	var menu = this;

	menu.search = '';
	menu.found;
	menu.condition = false;

	menu.execute = function(){

		MenuSearchService.getMenu(menu.search).then(function(result){
			//console.log(result);
			menu.found = result;
			if(menu.found.length==0){
				menu.condition = true;
			}
			else{
				menu.condition = false;
			}
		})
		

	}

	menu.remove = function(index){
		//console.log(index);
		menu.found.splice(index,1);
	}

}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http){

	var search = this;

	search.getMenu = function(searchTerm){
		

		return $http.get('https://davids-restaurant.herokuapp.com/menu_items.json')

			.then(function (result) {

				var list = result.data.menu_items;
				var newList = [];
				searchTerm = searchTerm.toLowerCase();

				for(var i=0; i<list.length; i++){

					var title = list[i].name.toLowerCase();
					var check = title.search(searchTerm);
					
					if(check !== -1){
						var object = {short_name: list[i].short_name, name: list[i].name, description: list[i].description}
						newList.push(object);
					}
				}

				if(searchTerm==''){
					newList = [];
				}

				return newList;
		   
		});
	};

}


function FoundItems(){

	var ddo = {

		controller: menuListingController,
		bindToController: true,
		controllerAs: 'menu',
		template: '<div style="clear:both;"><ul ng-repeat="item in menu.found"><li>({{item.short_name}})<b>{{item.name}}</b><ul><i>{{item.description}}</i></ul><ul><button ng-click="menu.remove($index)">Dont Want This One!</button></ul></li></ul></div>'
	};

	return ddo;
}


})();
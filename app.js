(function() {
    'use strict';
    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', foundItems)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

    // found item directive
    function foundItems() {
        var ddo = {
            scope: {
                myItems: '<',
                onRemove: '&'
            },
            templateUrl: 'foundList.html',
            controller: 'NarrowItDownController as list',
            bindToController: true
        };
        return ddo;
    }

    // directive parent controller
    NarrowItDownController.$inject = ['MenuSearchService', '$filter'];

    function NarrowItDownController(MenuSearchService, $filter) {
        var ctrl = this;

        // getting filtered list based on provided search input
        ctrl.findItems = function() {
            ctrl.foundItems = [];
            ctrl.foundItems = MenuSearchService.getMatchedMenuItems(ctrl.searchedItem);
        };

        // Removing unwanted menu for searched menu list
        ctrl.removeItem = function(itemIndex) {
            MenuSearchService.removeItem(itemIndex);
        }

    };

    // service
    MenuSearchService.$inject = ['$http', 'ApiBasePath', '$filter'];

    function MenuSearchService($http, ApiBasePath, $filter) {
        var service = this;
        var foundItems = [];

        service.getMatchedMenuItems = function(searchText) {
            var response = $http({
                    method: "GET",
                    url: (ApiBasePath + "/menu_items.json")
                }).then(function(response) {
                    var menuItems = response.data.menu_items;
                    angular.forEach(menuItems, function(item) {

                        if (item.description.toLowerCase().indexOf(searchText.toLowerCase()) >= 0) foundItems.push(item);

                    })
                })
                .catch(function(error) {
                    console.log("Something went wroing");
                });
            return foundItems;
        };
        service.removeItem = function(itemIndex) {
            foundItems.splice(itemIndex, 1);
        };

    }

})();

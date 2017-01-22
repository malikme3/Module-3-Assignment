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

        var searchText = ctrl.searchedItem;
        // getting filtered list based on provided search input
        ctrl.findItems = function() {
            ctrl.foundItems = [];
            var promise = MenuSearchService.getMatchedMenuItems();
            promise.then(function(response) {
                    ctrl.category = response.data.menu_items;
                    angular.forEach(ctrl.category, function(item) {

                        if (item.description.toLowerCase().indexOf(ctrl.searchedItem.toLowerCase()) >= 0) ctrl.foundItems.push(item);

                    })
                })
                .catch(function(error) {
                    console.log("Something went wroing");
                });
        };

        // Removing unwanted menu for searched menu list
        ctrl.removeItem = function(itemIndex) {
            ctrl.foundItems.splice(itemIndex, 1);
        }

    };

    // service
    MenuSearchService.$inject = ['$http', 'ApiBasePath', '$filter'];

    function MenuSearchService($http, ApiBasePath, $filter) {
        var service = this;

        service.getMatchedMenuItems = function() {
            var response = $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            });
            return response;
        };
        service.removeItem = function(itemIndex) {
            items[0].splice(itemIndex, 1);
        };

    }

})();

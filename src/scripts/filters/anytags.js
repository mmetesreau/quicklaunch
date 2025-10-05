(function () {
    'use strict';

    angular
        .module('app')
        .filter('anytags', ['commands',
            function (_commands) {
                return function (items, query) {

                    if (!query || query.length === 0)
                        return items;

                    const filtered = [];

                    if (items && items.length > 0) {
                        items.forEach((item) => {
                            if (item.tags && item.tags.length > 0) {
                                const queryParts = query.split(' ').map(queryPart => queryPart.trim().toLocaleLowerCase());

                                if (queryParts.every(queryPart => item.uri.toLocaleLowerCase().indexOf(queryPart) !== -1 || item.tags.some(tag => tag.indexOf(queryPart) !== -1))) {
                                    filtered.push(item);
                                }
                            }
                        });
                    }

                    return filtered;
                };
            }]);
})();

(function () {
    'use strict';

    const separator = ' ';

    angular
        .module('app')
        .service('parser', [
            function () {

                return {
                    run: run
                };

                function run(str) {

                    const entries = [];
                    let entry = '';

                    for (let i = 0; i < str.length; i++) {
                        const letter = str.charAt(i);

                        if (letter === separator) {
                            if (entry !== separator) {
                                entries.push(entry);
                            }

                            entry = '';
                        } else {
                            entry += letter;
                        }
                    }

                    if (entry !== '') {
                        entries.push(entry);
                    }

                    return entries;
                }
            }
        ]);
})();

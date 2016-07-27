'use strict';

var css = require('css');

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {         
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

module.exports = {
    calculate: function(first, second) {

        console.log(css);

        // parse input strings into trees
        var ast1 = css.parse(first);
        var ast2 = css.parse(second);

        // remove positions of blocks, and sort them
        function reduceTree(ast) {
            for (var i = ast.stylesheet.rules.length - 1; i >= 0; i--) {
                var rule = ast.stylesheet.rules[i];

                if (rule.type !== "rule") {
                    delete ast.stylesheet.rules[i];
                    continue;
                }

                for (var j = rule.declarations.length - 1; j >= 0; j--) {
                    delete rule.declarations[j].position;
                }

                // sort alphabetically by selector name
                rule.declarations.sort(function(a, b) {
                    if (a.property > b.property) {
                        return 1;
                    }

                    if (a.property < b.property) {
                        return -1;
                    }

                    return 0;
                });

                delete rule.position;
            }

            return ast;
        }

        // compile css from pure js object
        function compileCss(rules) {
            var header = {
                "type": "stylesheet",
                "stylesheet": {
                    "rules": [],
                    "parsingErrors": []
                }
            };

            header.stylesheet.rules = rules;

            return css.stringify(header);
        }

        // main code
        function calculateDiff(ast1, ast2) {
            var container = { added: [], removed: [] };

            // fill in removed array
            for (var i = ast1.stylesheet.rules.length - 1; i >= 0; i--) {
                container.removed.push( JSON.stringify(ast1.stylesheet.rules[i]) );
            }
            
            // fill in added array, and remove existing entries from "removed" array
            for (var i = ast2.stylesheet.rules.length - 1; i >= 0; i--) {
                var style = JSON.stringify(ast2.stylesheet.rules[i]);
                
                container.added.push( style );

                if (container.removed.indexOf(style) !== -1) {
                    delete container.removed[container.removed.indexOf(style)];
                }
            }

            // remove existing entries from "added" array
            for (var i = ast1.stylesheet.rules.length - 1; i >= 0; i--) {
                var style = JSON.stringify(ast1.stylesheet.rules[i]);
                if (container.added.indexOf(style) !== -1) {
                    delete container.added[container.added.indexOf(style)];
                }
            }

            // clear both arrays
            container.added.clean();
            container.removed.clean();

            // convert to js objects
            var addedTree = [], 
                removedTree = [];

            for (var i = container.added.length - 1; i >= 0; i--) {
                addedTree.push( JSON.parse( container.added[i]) );   
            }

            for (var i = container.removed.length - 1; i >= 0; i--) {
                removedTree.push( JSON.parse( container.removed[i]) );   
            }

            // compile and return
            return { removed: compileCss(removedTree), added: compileCss(addedTree) };
        }

        var ast1 = reduceTree(ast1);
        var ast2 = reduceTree(ast2);

        return calculateDiff(ast1, ast2);
    }
};

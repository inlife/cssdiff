var fs = require('fs');
var cssdiff = require('..');

function read(filename) {
    return fs.readFileSync( __dirname + '/' + filename ).toString('utf-8');
}

var difference = cssdiff.calculate(
    read('cur.css'), 
    read('new.css')
);

console.log( "Removed styles:\n" + difference.removed );
console.log( "\nAdded styles:\n" + difference.added );

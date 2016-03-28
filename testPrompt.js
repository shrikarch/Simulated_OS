var sortIt = require('sort-it');

var arr = [
    {firstName: 'z', lastName: 'ab'},
    {firstName: 'a', lastName: 'cd'},
    {firstName: 's', lastName: 'ef'},
    {firstName: 'd', lastName: 'gh'},
    {firstName: 'h', lastName: 'uj'}
];

var result = sortIt(arr, 'firstName');

console.log(result);

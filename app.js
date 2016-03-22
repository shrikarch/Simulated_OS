var prompt = require('prompt');
var DLL = require('doubly-linked-list');
var list = new DLL.DoublyLinkedList();

var objectA = {
    pid: 123,
    lux: "non"
}
list.append(objectA);
node = list.append('data2');
list.append('data3');

var nodey = list.item(0);
console.log(list._length);
console.log(nodey.data.pid);

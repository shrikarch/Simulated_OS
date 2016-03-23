var prompt = require('prompt');
var DLL = require('doubly-linked-list');
var list = new DLL.DoublyLinkedList();

function printPromt(callback){
    prompt.start(); //initiate the input from the user.
    // Get properties for PCB
    prompt.get(['processId', 'duration', 'priority'], function (err, result) {
        console.log('Command-line input received:');
        console.log('  Process ID: ' + result.processId);
        console.log('  Process Duration: ' + result.duration);
        console.log('  Process priority: ' + result.priority);
        var pcb = {
            pid: result.processId,
            duration: result.duration,
            priority: result.priority
        };
        callback(pcb);
    });

};

function addToLinkedList(pcb){
    //if (err) console.error('Error Handling LinkedList', err);
    //else{
        list.append(pcb);
        node = list.append('data2');
        list.append('data3');

        var nodey = list.item(0);
        //console.log(list._length);
        console.log("PID: " + nodey.data.pid + " Duration: " + nodey.data.duration);
        console.log(nodey);
    //};

};

printPromt(addToLinkedList);

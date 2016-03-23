var prompt = require('prompt');
var inquirer = require('inquirer');
var colors = require('colors');
var DLL = require('doubly-linked-list');
var readyQueue = new DLL.DoublyLinkedList();
var waitQueue = new DLL.DoublyLinkedList();

function listTraversal(listName){
    var i = 0;
    var qlength = listName._length;
    var node = listName.head();
    while(i < qlength){
        console.log(i + "-> " + "pID: " + node.data.pid.green + " Duration: " + node.data.duration.green + " Priority: " + node.data.priority.green);
        node = node.next;
        i++;
    };
}
function printPromt(){
    inquirer.prompt([
        {
            type: "list",
            name: "op",
            message: "\nWhat do you want to do?",
            choices: [
                {
                    name: "Add a process to READY queue",
                    value: "adReady"
                },
                {
                    name: "Add a process to WAITING queue",
                    value: "adWait"
                },
                {
                    name: "Remove a process from READY queue",
                    value: "rmReady"
                },
                {
                    name: "Remove a process from WAITING queue",
                    value: "rmWait"
                },
                {
                    name: "Show what is in READY queue",
                    value: "lsReady"
                },
                {
                    name: "Show what is in WAITING queue",
                    value: "lsWait"
                },
                {
                    name: "EXIT".red,
                    value: "true"
                }
            ]
        },
        {
            type: "input",
            name: "pid",
            message: "Give this process an ID number: ",
            default: "1200",
            when: function ( answers ) {
                return answers.op == 'adReady' | answers.op == 'adWait' | answers.op == 'rmReady';
            }
        },
        {
            type: "input",
            name: "duration",
            message: "How long will this process run? (ms)",
            default: "10",
            when: function ( answers ) {
                return answers.op == 'adReady' | answers.op == 'adWait';
            }
        },
        {
            type: "input",
            name: "priority",
            message: "What's the priority of this process? (1-top 10-least)",
            default: "2",
            when: function ( answers ) {
                return answers.op == 'adReady' | answers.op == 'adWait';
            }
        },
        {
            type: "input",
            name: "priority",
            message: "Enter the ID of the process you want to remove.",
            when: function ( answers ) {
                answers.op == 'rmReady' | answers.op == 'rmWait';
            }
        }

    ], function( answers ) {
        //console.log(answers);
        if(answers.op == 'adReady'){
            //callback(answers);
            addToQueue(readyQueue, answers); //adds the pcb to ready queue.
        }else if(answers.op == 'adWait'){
            //console.log(answers.op);
            addToQueue(waitQueue, answers); //adds pcb to waiting queue.
        }else if(answers.op == 'rmReady'){
            removeFromQueue(readyQueue, answers.pid);
        }else if(answers.op == 'rmWait'){
            console.log(answers.op);
        }else if(answers.op == 'lsReady'){
            showReady();
        }else if(answers.op == 'lsWait'){
            showWait();
        }else{
            inquirer.prompt(
                {
                    type: "confirm",
                    name: "exit",
                    message: "You'll loose all the queue data.".red + "\n Are you sure you want to exit?",
                    default: false
                }, function( decision ) {
                    return exitProgram(decision);
                });
        }

    });


};

function addToQueue(queName, pcb){
    var node = queName.append(pcb);
    console.log("PID: " + node.data.pid + " Duration: " + node.data.duration);
    //console.log(readyQueue._length);
    //console.log(node);
    printPromt();
};
function removeFromQueue(listName, procID){
    var i = 0;
    var hitFlag = null;
    var qlength = listName._length;
    var node = listName.head();
    while(i < qlength){
        if(procID == node.data.pid){
            inquirer.prompt(
                {
                    type: "confirm",
                    name: "confirmDelete",
                    message: "You are about to delete process ".red + procID + " Confirm?",
                    default: false
                }, function( decision ) {
                    return deleteNode(decision);
                });
            hitFlag = 'set';}
        node = node.next;
        i++;
    };
    if(hitFlag == null)
        console.log("The queue is already empty!");
    //======
    //var node = readyQueue.item(1);
    //node.remove();
}

function showReady(){
    listTraversal(readyQueue);
    printPromt();
};
function showWait(){
    listTraversal(waitQueue);
    printPromt();
};
function exitProgram(decision){
    if(decision.exit)
        console.log('Alrighty. Good Bye.');
    else
        printPromt();
};
function deleteNode(decision){
    if(decision.confirmDelete){

    }
    printPromt();
};


printPromt();

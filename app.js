//importing required libraries
var prompt = require('prompt');
var inquirer = require('inquirer');
var colors = require('colors');
var DLL = require('doubly-linked-list');
var readyQueue = new DLL.DoublyLinkedList();
var waitQueue = new DLL.DoublyLinkedList();

//Prints the menu and catches the user input
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
            message: "What's the process ID number? ",
            default: "1200",
            when: function ( answers ) {
                return answers.op == 'adReady' | answers.op == 'adWait' | answers.op == 'rmReady' | answers.op == 'rmWait';
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
            name: "rmPid",
            message: "Enter the ID of the process you want to remove.",
            when: function ( answers ) {
                answers.op == 'rmReady' | answers.op == 'rmWait';
            }
        }
//conditional logic - What operation to do for which option.
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
            removeFromQueue(waitQueue,answers.pid);
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


//FUNCTION DEFINITIONS
function checkIfPresent(listName, procID){ //checks if node is present in the given list.
    var i = 0;
    var hitFlag = false;
    var pos = null;
    var qlength = listName._length;
    var node = listName.head();
    while(i < qlength){
        if(procID == node.data.pid){
            //deleteNode(procID, node);
            pos = node;
            hitFlag = true;
        }
        node = node.next;
        i++;
    };
    return {presence: hitFlag, node:pos};
};
function listTraversal(listName){ //traverses the list.
    var i = 0;
    var qlength = listName._length;
    var node = listName.head();
    while(i < qlength){
        console.log(i + "-> " + "pID: " + node.data.pid.green + " Duration: " + node.data.duration.green + " Priority: " + node.data.priority.green);
        node = node.next;
        i++;
    };
};
function addToQueue(listName, pcb){ //adds the node at the end of the queue.
    var node = listName.append(pcb);
    console.log("PID: " + node.data.pid + " Duration: " + node.data.duration);
    printPromt(); //takes user back to the menu,
};
function removeFromQueue(listName, procID){ //deletes from the queue.
    var present = checkIfPresent(listName, procID);
    if(present.presence){
        deleteNode(procID,present.node)
    }else{
        console.log("No such process.");
        printPromt();
    }
};
function showReady(){ //called when user chooses to see ready queue.
    listTraversal(readyQueue);
    printPromt();
};
function showWait(){ //called when user selects to see waiting queue.
    listTraversal(waitQueue);
    printPromt();
};
function exitProgram(decision){ //exit the program
    if(decision.exit)
        console.log('Alrighty. Good Bye.');
    else
        printPromt();
};
function deleteNode(procID, node){ //deletes the node.
    console.log("Deleting process: ".yellow + procID.green);
    node.remove();
    printPromt();
};


printPromt();

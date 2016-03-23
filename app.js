var prompt = require('prompt');
var inquirer = require('inquirer');
var DLL = require('doubly-linked-list');
var readyQueue = new DLL.DoublyLinkedList();
var waitQueue = new DLL.DoublyLinkedList();

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
                }
            ]
        },
        {
            type: "input",
            name: "pid",
            message: "Give this process an ID number: ",
            default: "1200",
            when: function ( answers ) {
                return answers.op == 'adReady' ;
            }
        },
        {
            type: "input",
            name: "duration",
            message: "How long will this process run? (ms)",
            default: "10",
            when: function ( answers ) {
                return answers.op == 'adReady' ;
            }
        },
        {
            type: "input",
            name: "priority",
            message: "What's the priority of this process? (1-top 10-least)",
            default: "2",
            when: function ( answers ) {
                return answers.op == 'adReady' ;
            }
        },
        {
            type: "input",
            name: "priority",
            message: "Enter the ID of the process you want to remove.",
            when: function ( answers ) {
                answers.op == 'rmReady' ;
            }
        },
        {
            type: "input",
            name: "priority",
            message: "What's the priority of this process? (1-top 10-least)",
            when: function ( answers ) {
                return answers.op == 'rmWait' ;
            }
        }

    ], function( answers ) {
        //console.log(answers);
        if(answers.op == 'adReady'){
            //callback(answers);
            addToReady(answers); //adds the pcb to ready queue.
        }else if(answers.op == 'adWait'){
            //console.log(answers.op);
            addToWait(answers); //adds pcb to waiting queue.
        }else if(answers.op == 'rmReady'){
            console.log(answers.op);
        }else if(answers.op == 'rmWait'){
            console.log(answers.op);

        }else if(answers.op == 'lsReady'){
            //console.log(answers.op);
            showReady();

        }else{
            console.log('nin');
        }

    });


};

function addToReady(pcb){
    var node = readyQueue.append(pcb);
    console.log("PID: " + node.data.pid + " Duration: " + node.data.duration);
    //console.log(readyQueue._length);
    //console.log(node);
    printPromt();
};
function addToWait(pcb){
    var node = waitQueue.append(pcb);
    console.log("PID: " + node.data.pid + " Duration: " + node.data.duration);
    //console.log(readyQueue._length);
    printPromt();
};
function showReady(){
    //console.log(readyQueue.head());
    var i = 0;
    var qlength = readyQueue._length;
    var node = readyQueue.head();
    //console.log(node.data);
    while(i < qlength){
        console.log(node.data);
        node = node.next;
        i++;
    }
    /*for(var node in readyQueue){
        console.log(node);
    }*/
    printPromt();
};

printPromt();

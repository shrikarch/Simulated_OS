//importing required libraries
var inquirer = require('inquirer');
var colors = require('colors');
var DLL = require('./doubly-linked-list');
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
                    name: "SJF Scheduling",
                    value: "schD"
                },
                {
                    name: "Priority Scheduling",
                    value: "priD"
                },
                {
                    name: "Round Robin Scheduling",
                    value: "roundR"
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
            message: "How long will this process run?(ms)",
            default: "3",
            when: function ( answers ) {
                return answers.op == 'adReady' | answers.op == 'adWait';
            }
        },
        {
            type: "input",
            name: "priority",
            message: "What's the priority of this process? (1-top 4-least)",
            default: "2",
            when: function ( answers ) {
                return answers.op == 'adReady' | answers.op == 'adWait';
            }
        },
        {
            type: "input",
            name: "rmPid",
            message: "Enter the ID of the process you want to remove",
            when: function ( answers ) {
                answers.op == 'rmReady' | answers.op == 'rmWait';
            }
        },
        {
            type: "input",
            name: "timeQ",
            message: "How big will be the time quantum?(ms)",
            default: "3",
            when: function ( answers ) {
                return answers.op == 'roundR';
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
            showQueue(readyQueue);
        }else if(answers.op == 'lsWait'){
            showQueue(waitQueue);
        }else if(answers.op == 'schD'){
            scheduler(readyQueue);
        }else if(answers.op == 'priD'){
            priScheduler(readyQueue);
        }else if(answers.op == 'roundR'){
            roundRobin(readyQueue,answers.timeQ);
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
    return {presence: hitFlag, node:pos}; //returns true or false in presence and whole node in node.
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
    var present = checkIfPresent(readyQueue,pcb.pid)
    var presentW = checkIfPresent(waitQueue,pcb.pid)
    if(present.presence || presentW.presence){
        console.log("Process already exists in one of the queues. Try another ID".red);
    }else{
        var node = listName.append(pcb);
        console.log("PID: " + node.data.pid + " Duration: " + node.data.duration);
    }
    printPromt(); //takes user back to the menu,
};
function removeFromQueue(listName, procID){ //deletes from the queue.
    var present = checkIfPresent(listName, procID);
    if(present.presence){
        deleteNode(procID,present.node)
    }else{
        console.log("No existing process with that ID");
        printPromt();
    }
};
function showQueue(listName){ //called when user chooses to see any queue.
    listTraversal(listName);
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
function scheduler(listName){
    var nodeArr = [];
    var i = 0;
    var waitTime = 0;
    var lastTime;
    var qlength = listName._length;
    var node = listName.head();
    while(i < qlength){
        nodeArr.push(node);
        node = node.next;
        i++;
    };
    var result = nodeArr.sort(function(a,b){
        return a.data.duration - b.data.duration;
    });
    result.forEach(function(node){
        console.log("pID: " + node.data.pid.green + " Duration: " + node.data.duration.green + " Priority: " + node.data.priority.green+"\n");
    });
    result.forEach(function(node){
        console.log("Waiting time for process "+node.data.pid.green+" is "+waitTime);
        waitTime = waitTime + parseInt(node.data.duration);
        lastTime = node.data.duration;
    });
    console.log("Average wait time is "+ ((waitTime - lastTime)/nodeArr.length));
    printPromt();
};
function priScheduler(listName){
    var nodeArr = [];
    var i = 0;
    var waitTime = 0;
    var lastTime;
    var qlength = listName._length;
    var node = listName.head();
    while(i < qlength){
        nodeArr.push(node);
        node = node.next;
        i++;
    };
    var result = nodeArr.sort(function(a,b){
        return a.data.priority - b.data.priority;
    });
    result.forEach(function(node){
        console.log("pID: " + node.data.pid.green + " Duration: " + node.data.duration.green + " Priority: " + node.data.priority.green+"\n");
    });
    result.forEach(function(node){
        console.log("Waiting time for process "+node.data.pid.green+" is "+waitTime);
        waitTime = waitTime + parseInt(node.data.duration);
        lastTime = node.data.duration;
    });
    console.log("Average wait time is "+ ((waitTime - lastTime)/nodeArr.length));
    printPromt();
};
function roundRobin(listName,timeQ){
    var i = 0;
    var stack = [];
    var qlength = listName._length;
    var node = listName.head();
    while(i < qlength){
        node.data.td = parseInt(node.data.duration);
        if(node.data.td > timeQ){
            node.data.td = node.data.td - timeQ;
            stack.push(true);
            node.data.complete = false;
        }else{
            node.data.complete = true;
        }
        console.log("Process number: "+node.data.pid.green+" Duration: "+node.data.duration.green+" is it complete? "+node.data.complete);
        //console.log(stack);
        node = node.next;
        i++;
    };
    var ite = 1;
    while(stack.length != 0){
        //console.log(stack);
        var j = 0;
        var node = listName.head();
        console.log("\nNew Iteration: ".cyan + ite)
        while(j<qlength){
            if(node.data.complete === false){
                if(node.data.td > timeQ){
                    node.data.td = node.data.td - timeQ;
                    //stack.push(true);
                    node.data.complete = false;
                    //console.log("addedto stack. Current stack- ".yellow+stack);
                    console.log("for process "+node.data.pid.green+" rem time: "+colors.green(node.data.td));
                }else{
                    node.data.complete = true;
                    stack.splice(0,1);
                    //console.log("removing from stack. current stack- ".yellow+stack);
                    console.log("Process "+node.data.pid.green+" completed execution");
                }
            }
            node = node.next;
            j++;
        }
        ite++;
    }
    printPromt();
};


printPromt();

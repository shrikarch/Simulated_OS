var inquirer = require("inquirer");

inquirer.prompt([
    {
        type: "list",
        name: "op",
        message: "What do you want to do?",
        choices: [
            {
                name: "Add a process to READY queue",
                value: "PeperonniChesse"
            },
            {
                name: "Add a process to READY queue",
                value: "mumchow"
            },
            {
                name: "Add a process to READY queue",
                value: "PeperonniChesse"
            },
            {
                name: "Add a process to READY queue",
                value: "PeperonniChesse"
            }

            //new inquirer.Separator(),
        ]
    }
], function( answers ) {
    console.log(answers.op);
});

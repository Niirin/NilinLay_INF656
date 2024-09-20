const {promises: fs} = require("fs");
const readline = require('readline')
const { stdin: input, stdout: output } = require('node:process')

//function to get all tasks from tasks.json file
async function getAllTasks() {
        const tasks = await fs.readFile('./tasks.json', "utf8", (err, data) => {
            if (err) {
                console.log(err, 'Cannot open file');
            } else {
                return data;
            }
        })
        return JSON.parse(tasks);
}

//function to list and format all tasks retrieved
async function listTasks() {
    const tasks = await getAllTasks();
    console.log('\nFetching tasks...\n');
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (tasks) {
        for (let i = 0; i <tasks.length; i++) {
            console.log(`Task ${i+1}: ${tasks[i].title} \nStatus: ${tasks[i].status}\n`);
        }
    }
    else {
        console.log("No tasks added inside file.");
    }

}

//function to save tasks back into file
async function saveTasks(tasks) {
    await fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2), "utf8", (err, data)=> {
        if (err) {
            console.log(err, 'Error saving tasks to file.');
        } else {
            return data;
        }
    })
}

//function to add new task to file with default status of not completed
async function addTask(title, desc) {
    const tasks = await getAllTasks();
    // console.log(tasks);
    const newTask = {title:`${title}`, description: `${desc}`, status: "Not completed"};
    tasks.push(newTask);
    console.log('Adding new task...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    saveTasks(tasks);
    console.log("Task has been added successfully.");
}

//function to mark task as completed and save new task status to file
async function completeTask(title) {
    const tasks = await getAllTasks();
    const task = tasks.find(task => task.title.toLowerCase() === title.toLowerCase());
    // console.log(task);
    if (task) {
        if(task.status !== "Completed") {
            task.status = "Completed";
            await saveTasks(tasks);
            console.log('Marking task complete...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`Task "${title}" marked as completed.`);
        }
        else {
            console.log('Task already completed.');
        }     
    } else {
        console.log(`Task "${title}" not found.`);
    }

    
}


// User interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


const welcomeMess= "Welcome to Lin's Task Manager!\nWhat would you like to do?\n1). List all tasks\n2). Add new task\n3). Mark task as complete\n0). Exit"

//recursive function to display ui like a do-while loop asynchronously
function start() {
    console.log(welcomeMess);
    rl.question('Enter a number:' , async (choice) => {
        switch(choice) {
            case '1':
                await listTasks();
                start();
                break;
            case '2':
                rl.question('Enter task title:', async (title)=> {
                    rl.question('Enter task description:', async (des)=> {
                    await addTask(title, des); 
                    start();
                });
                })
                break;
            case '3':
                rl.question('Enter task title to mark as complete:', async (title)=> {
                    await completeTask(title);
                    start();
                })
                
                break;
            case '0':
                console.log('Exiting...');
                setTimeout(() => {
                    rl.close()
                }, 1000);
                break;
            default:
                console.log('Invalid input! Please enter a number!');
                start();
                break;
        }
    
    })

}

start();
    
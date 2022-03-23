let time; 
let hasEndAlerted = false;
let hasCleanupAlerted = false;
let timeEntered = false;
let muted = false;

var taskVals = [];
var tasks = [];
var options = {};

//Timer elements
const timerContainer = document.getElementById("timer");
const timer = document.getElementById('timerNumbers');
const timeForm = document.getElementById("timeForm");

//Task elements
const listContainer = document.querySelector("#taskList");
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const listEl = document.getElementById("taskList");
// console.log(form);

// buildTasks();
// console.log(taskEl.firstChild.firstChild.value);

setInterval(startup, 2000);
startup();
async function startup(){
    tasks = [];
    const response = await fetch('/updateTasks');
    const json = await response.json();
    console.log(json);

    var isDifferent = false;
    var children = listContainer.children;
    if(children.length > 0){
        for (let i = 0; i < json.tasks.length; i++) {
            if(json.tasks[i] != children[i].firstChild.firstChild.value) isDifferent = true;
            break;
        }
    }else{
        isDifferent = true;
    }
    if(isDifferent){
        while (listContainer.firstChild) {
            listContainer.removeChild(listContainer.firstChild);
        }

        for (let i = 0; i < json.tasks.length; i++) {
            const element = json.tasks[i];
            createTask(element, false);
        }
    }else{
        console.log("wasnt different");
    }
}

//set timer to update every second
setInterval(updateTime, 1000);

if(form){
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        //Create task object: 
        const task = {
            value: input.value,
            assignedTo: "",
            dueDate: ""
        }
         
        if(!(task.value)){
            alert("Please fill in task");
            return;
        }
        createTask(task.value, true);
    })
    // Event listener for which div is being hovered over while dragging
    listContainer.addEventListener('dragover', e => {
        e.preventDefault();
        
        const afterElement = getDragAfterElement(e.clientY);
        const draggingEl = document.querySelector('.dragging');
        
        if(afterElement == null){
            listContainer.appendChild(draggingEl);

            // var temp = tasks[tasks.length - 1];
            // tasks[tasks.length - 1] = tasks[tasks.indexOf(draggingEl.firstChild.firstChild.value)];
            // tasks[tasks.indexOf(draggingEl.firstChild.firstChild.value)] = temp;
            // [tasks[tasks.indexOf(draggingEl.textContent)], tasks[tasks[tasks.length - 1]]] = [[tasks[tasks.length - 1]], tasks[tasks.indexOf(draggingEl.textContent)]];
        } else{
            listContainer.insertBefore(draggingEl, afterElement);

            // var temp = tasks[tasks.indexOf(afterElement.firstChild.firstChild.value)];
            // tasks[tasks.indexOf(afterElement.firstChild.firstChild.value)] = tasks[tasks.indexOf(draggingEl.firstChild.firstChild.value)];
            // tasks[tasks.indexOf(draggingEl.firstChild.firstChild.value)] = temp;

            // [tasks[tasks.indexOf(draggingEl.textContent)], tasks[tasks.indexOf(afterElement.textContent)]] = [tasks[tasks.indexOf(afterElement.textContent)], tasks[tasks.indexOf(draggingEl.textContent)]];
        }
        // console.log(draggingEl.firstChild.firstChild.value);
        // console.log(tasks[tasks.indexOf(draggingEl.firstChild.firstChild.value)]);
    })
 
    //Gets the element after the one you are hovering on
    function getDragAfterElement(y){
        const draggableEls = [...listContainer.querySelectorAll('.draggable:not(.dragging)')];
        
        return draggableEls.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height;
            
            if(offset < 0 && offset > closest.offset){
                return{offset: offset, element:child};
            }else{
                return closest;
            }
        },{offset: Number.NEGATIVE_INFINITY}).element;
    }
}else{
    console.log("No form to submit tasks on this page"); // if the page doesnt have a task input (home page)
}

//Event listener for time input box
timeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    enterTime();
})

function buildTasks(){
    const children = listContainer.children;
    tasks = [];
    for (let index = 0; index < children.length; index++) {
        // console.log(children[index].firstChild.firstChild.value);
        // console.log(tasks);
        tasks.push(children[index].firstChild.firstChild.value);
    }
    
}

async function createTask(value, isNew){
    //Create Task div
    const taskEl = document.createElement("div");
    taskEl.classList.add("task");
    taskEl.classList.add("draggable");
    taskEl.setAttribute("draggable", "true");

    //Create Content element
    const taskContentEl = document.createElement("div");
    taskContentEl.classList.add("content");

    //Add content to task
    taskEl.appendChild(taskContentEl);

    //Add the task text / input itself
    const taskInputEl = document.createElement("input");
    taskInputEl.classList.add("text");
    taskInputEl.type = "text";
    taskInputEl.value = value;
    tasks.push(taskInputEl.value);
    console.log(tasks);
    taskInputEl.setAttribute("readonly", "readonly");

    taskContentEl.appendChild(taskInputEl);

    // Create actions element
    const taskActionsEl = document.createElement("div");
    taskActionsEl.classList.add("actions");

    //Create edit element
    const taskEditEl = document.createElement("button");
    taskEditEl.classList.add("edit");
    taskEditEl.innerHTML = "Edit";

    //Create delete element
    const taskDeleteEl = document.createElement("button");
    taskDeleteEl.classList.add("delete");
    taskDeleteEl.innerHTML = "X";

    // Add buttons to actions el and add that to the task
    taskActionsEl.appendChild(taskEditEl);
    taskActionsEl.appendChild(taskDeleteEl);

    taskEl.appendChild(taskActionsEl);
    // add task to the list
    listEl.appendChild(taskEl);

    if(isNew){
        // buildTasks();
        // console.log(taskEl.firstChild.firstChild.value);
        var val = {value: taskEl.firstChild.firstChild.value};
        options = {method:"POST",headers:{"Content-Type":"application/json"},
            body: JSON.stringify(val)
        };
        const response = await fetch('/newTask', options);
        const json = await response.json();
        console.log(json);
    }
    input.value = ""; // reset input for next task

    //Event listeners for dragging
    taskEl.addEventListener('dragstart', () =>{
        taskEl.classList.add('dragging');
    })
    taskEl.addEventListener('dragend', async () =>{
        taskEl.classList.remove('dragging');
        buildTasks();
        options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(tasks)
        };
        const response = await fetch('/moveTask', options);
        const json = await response.json();
        console.log(json);
    })

    //Add event listener for edit button
    taskEditEl.addEventListener('click', () => {
        if(taskEditEl.innerText.toLowerCase() == "edit"){
            taskInputEl.removeAttribute("readonly");
            taskInputEl.focus();
            taskEditEl.innerText = "Save";
        }else{
            taskInputEl.setAttribute("readonly", "readonly");
            taskEditEl.innerText = "Edit";
            console.log(tasks);
        }
    })

    //Add event listener for delete button
    taskDeleteEl.addEventListener('click', async () => {
        tasks.splice(tasks.indexOf(taskInputEl.value),1);

        var val = {value: taskEl.firstChild.firstChild.value};
        options = {method:"POST",headers:{"Content-Type":"application/json"},
            body: JSON.stringify(val)
        };
        const response = await fetch('/delTask', options);
        const json = await response.json();
        console.log(json);

        listEl.removeChild(taskEl);
        console.log(tasks);
    })
}

//Updates the timer every second
function updateTime(){
    let hours = Math.floor(time / 60 / 60);
    let minutes = Math.floor(time / 60 % 60);
    let seconds = time % 60;
    
    if(minutes < 10){
        minutes = '0' + minutes;
    }
    if(seconds < 10){
        seconds = '0' + seconds;
    }
    
    if(time > 0){
        timer.innerHTML = `${hours}:${minutes}:${seconds}`;
        document.title = `${hours}:${minutes}:${seconds}`;
        time--;
    }else{
        if(!hasEndAlerted && timeEntered == true){
            alert("Time has run out!");
            hasEndAlerted = true;
            document.title = "Time's Up!";
        }
        timer.innerHTML = "No time left!";
    }
    if(time < 600 & !hasCleanupAlerted & timeEntered == true){
        alert("Time to clean up!");
        hasCleanupAlerted = true;
        timerContainer.style.backgroundColor = "#f00";
    }
}

// Calculates and updates the current time
function enterTime(){
    var today = new Date();
    let curTime = (today.getHours() * 60 * 60) + (today.getMinutes() * 60) + (today.getSeconds());
    let endTime = document.getElementById("timeInput").value;
    
    if(endTime.includes(":")){
        var tempArray = endTime.split(':'),hours = Number(tempArray[0]), minutes = Number(tempArray[1]);
        if(curTime > 12 * 3600 && hours < 13){
            hours += 12;
        }
        endTime = Number(hours) + (Number(minutes) / 60);
    }else{
        endTime = Number(document.getElementById("timeInput").value);
        if(curTime > 12 * 3600 && endTime < 13){
            endTime += 12;
        }
    }

    console.log(endTime);
    endTime *= 3600;

    timerContainer.style.backgroundColor = "#333";

    time = endTime - curTime;  
    time = Math.floor(time); 

    if(time < 1){
        alert("Time invalid (already passed)");
        time = 0;
    }else{
        timeEntered = true;
        hasEndAlerted = false;
        hasCleanupAlerted = false;
    }
}
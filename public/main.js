let time; 
let hasEndAlerted = false;
let hasCleanupAlerted = false;
let timeEntered = false;
let muted = false;

var taskVals = [];
var tasks = [];
var options = {};

let endTime;

let eMembers = ['Everyone','Carter', 'Maxine', 'Gavin'];
let mMembers = ['Everyone','Mitchel', 'Megan', 'Zephyr','Jake', 'Jiana', 'Lane', 'Zack','Pheonix'];
let pMembers = ['Everyone','Noah', 'Henry', 'Claire','Troy'];

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

// setInterval(startup, 2000);

var thisPage;
if(window.location.href.includes("electronics")){
    thisPage = "electronics";
}else if(window.location.href.includes("mechanics")){
    thisPage = "mechanics";
}else if(window.location.href.includes("programming")){
    thisPage = "programming";
}

setInterval(syncTime, 30000);
function syncTime(){
    enterTime(endTime);
}

startup();
async function startup(){
    tasks = [];
    var response = await fetch('/updateTasks');
    var json = await response.json();
    console.log(json);

    var tasksDifferent = false;
    if(listContainer != null){ // if this page even has tasks
        /*var children = listContainer.children;
        if(children.length > 0){
            for (let i = 0; i < json.tasks.length; i++) {
                if(json.tasks[i].task != children[i].firstChild.firstChild.value & children[i].children[1].firstChild.innerText != 'SAVE' & document.querySelector('.dragging') == undefined){
                    tasksDifferent = true;
                    break;
                }
            }
        }else{
            tasksDifferent = true;
        }
        if(tasksDifferent){
            while (listContainer.firstChild) {
                listContainer.removeChild(listContainer.firstChild);
            }*/

            for (let i = 0; i < json.tasks.length; i++) {
                const element = json.tasks[i].task;
                const assignment = json.tasks[i].assignedTo;
                createTask(element, false, assignment);
            }
            /*console.log("was different or empty");
        }else{
            console.log("wasnt different");
        }*/
    }
    
    if(json.endTime != undefined){
        enterTime(json.endTime);
    }
}

var source = new EventSource("../updates");
source.onmessage = function(event) {
    var data = JSON.parse(event.data);
    if(data.target == "endTime"){
        enterTime(data.data);
    }else if(data.target == "tasks" && data.page == thisPage){
        rebuild(data.data);
    }
};

function rebuild(tasksList){
    while (listContainer.firstChild) {
        listContainer.removeChild(listContainer.firstChild);
    }
    tasks = [];
    console.log(tasksList);
    for (let i = 0; i < tasksList.length; i++) {
        const children = listContainer.children;
        const element = tasksList[i].task;
        createTask(element, false, tasksList[i].assignedTo);
        const curTask = {type: thisPage, task: tasksList[i].task, assignedTo: tasksList[i].assignedTo};
        tasks.push(curTask);
    }
}


//set timer to update every second
setInterval(updateTime, 1000);

if(form){
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const taskVal = input.value;
         
        if(!taskVal){
            alert("Please fill in task");
            return;
        }
        createTask(taskVal, true);
    })
    // Event listener for which div is being hovered over while dragging
    listContainer.addEventListener('dragover', e => {
        e.preventDefault();
        
        const afterElement = getDragAfterElement(e.clientY);
        const draggingEl = document.querySelector('.dragging');
        
        if(afterElement == null){
            listContainer.appendChild(draggingEl);
        } else{
            listContainer.insertBefore(draggingEl, afterElement);
        }

    })
 
    //Gets the element after the one you are hovering on
    function getDragAfterElement(y){
        const draggableEls = [...listContainer.querySelectorAll('.draggable:not(.dragging)')];
        
        return draggableEls.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
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
        var curNode = children[index].childNodes[1].firstChild.firstChild;
        curNode.nodeValue.trim();
        const curTask = {type: thisPage, task: children[index].firstChild.firstChild.value, assignedTo: curNode.nodeValue, index: index};
        tasks.push(curTask);
    }
}

async function createTask(value, isNew, assignment){
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

    //Create assign element
    const assignedToEl = document.createElement("button");
    assignedToEl.classList.add('assignedTo');
    if(assignment != null & assignment != undefined){
        assignedToEl.innerHTML = assignment;
    }else{
        assignedToEl.innerHTML = 'Everyone';
    }

    const assignmentDropContainer = document.createElement('div');
    assignmentDropContainer.classList.add('dropContainer');
    let memberList;
    if(thisPage == 'electronics'){
        memberList = eMembers;
    } else if (thisPage == 'mechanics'){
        memberList = mMembers;
    }else{
        memberList = pMembers;
    }
    for (let i = 0; i < memberList.length; i++) {
        const memberDropEl = document.createElement('button');
        memberDropEl.classList.add('memberDrop');
        memberDropEl.innerHTML = memberList[i];
        memberDropEl.addEventListener('click', async() => {
            var val = {parent: memberDropEl.parentElement.parentElement.parentElement.parentElement.firstChild.firstChild.value ,value: memberDropEl.textContent};
            options = {method:"POST",headers:{"Content-Type":"application/json"},
                body: JSON.stringify(val)
            };
            const response = await fetch('/changeAssign', options);
            const json = await response.json();
            console.log(json);
            memberDropEl.parentElement.parentElement.innerHTML = memberDropEl.innerHTML;
        });
        assignmentDropContainer.appendChild(memberDropEl);
    }

    assignedToEl.appendChild(assignmentDropContainer);

    //Create edit element
    const taskEditEl = document.createElement("button");
    taskEditEl.classList.add("edit");
    taskEditEl.innerHTML = "Edit";

    //Create delete element
    const taskDeleteEl = document.createElement("button");
    taskDeleteEl.classList.add("delete");
    taskDeleteEl.innerHTML = "X";

    // Add buttons to actions el and add that to the task
    taskActionsEl.appendChild(assignedToEl);
    taskActionsEl.appendChild(taskEditEl);
    taskActionsEl.appendChild(taskDeleteEl);

    taskEl.appendChild(taskActionsEl);
    // add task to the list
    listEl.appendChild(taskEl);
 
    //Send to server
    if(isNew){
        var val = {value: taskEl.firstChild.firstChild.value};
        options = {method:"POST",headers:{"Content-Type":"application/json"},
            body: JSON.stringify(val)
        };
        const response = await fetch('/newTask', options);
        const json = await response.json();
        console.log('newtask json: ', json);
    }
    input.value = ""; // reset input for next task

    //Event listeners for dragging
    taskEl.addEventListener('dragstart', () =>{
        taskEl.classList.add('dragging');
    })
    taskEl.addEventListener('dragend', async () =>{
        taskEl.classList.remove('dragging');
        console.log("dragend: ",tasks);
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

    assignedToEl.addEventListener('click', () => {
        // if(assignedToEl.getElementsByClassName('dropContainer')[0].style.display = 'none'){
        //     assignedToEl.getElementsByClassName('dropContainer')[0].style.display = 'flex';
        // }else if(assignedToEl.getElementsByClassName('dropContainer')[0].style.display = 'flex'){
        //     assignedToEl.getElementsByClassName('dropContainer')[0].style.display = 'none';
        // }
    });

    //Add event listener for edit button
    taskEditEl.addEventListener('click', async () => {
        if(taskEditEl.innerText.toLowerCase() == "edit"){
            taskInputEl.removeAttribute("readonly");
            taskInputEl.focus();
            taskEditEl.innerText = "Save";
        }else{
            taskInputEl.setAttribute("readonly", "readonly");
            taskEditEl.innerText = "Edit";
            buildTasks();
            var tempTasks = [];
            for (let i = 0; i < tasks.length; i++) {
                tempTasks[i] = tasks[i].task;
            }
            console.log(tasks, tempTasks);
            var tempval = taskEl.firstChild.firstChild.value;
            var val = {index: tempTasks.indexOf(tempval),value: tempval};
            console.log(val);
            options = {method:"POST",headers:{"Content-Type":"application/json"},
                body: JSON.stringify(val)
            };
            const response = await fetch('/editTask', options);
            const json = await response.json();
            console.log(json);
            // console.log(tasks);
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
        // alert("Time to clean up!");
        // timerContainer.style.backgroundColor = '#f00'; // document.documentElement.style.getPropertyValue('--warn')
        hasCleanupAlerted = true;
    }
    if(time < 600 & timerContainer.style.backgroundColor != '#f00'){
        timerContainer.style.backgroundColor = '#f00'; // document.documentElement.style.getPropertyValue('--warn')
    }
}

// Calculates and updates the current time
async function enterTime(inputTime){
    var today = new Date();
    let curTime = (today.getHours() * 60 * 60) + (today.getMinutes() * 60) + (today.getSeconds());
    console.log("input time: ",inputTime);
    if(inputTime == undefined){
        
        endTime = document.getElementById("timeInput").value;
        
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

        

        // if(time < 1){
        //     time += 12 * 3600;
        //     endTime += 12 * 3600;
        // }

        var val = {value: endTime};
        options = {method:"POST",headers:{"Content-Type":"application/json"},
            body: JSON.stringify(val)
        };
        const response = await fetch('/setTime', options);
        const json = await response.json();
        console.log(json);

        timerContainer.style.backgroundColor = document.documentElement.style.getPropertyValue('--medium');
    
    }else{
        endTime = inputTime;

    }

    time = endTime - curTime;  
    time = Math.floor(time);

    document.getElementById("timeInput").value = "";
    
    // console.log(inputTime);
    
    if(time < 1 && inputTime == undefined){
        // alert("Time invalid (already passed)");
        time += 12 * 3600;
    }else if(time > 0){
        timeEntered = true;
        hasEndAlerted = false;
        hasCleanupAlerted = false;
    }
}

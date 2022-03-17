var today = new Date();
let time; 
let hasEndAlerted = false;
let hasCleanupAlerted = false;
let timeEntered = false;
let muted = false;

var tasks = [];

const timerContainer = document.getElementById("timer");
const timer = document.getElementById('timerNumbers');
const timeForm = document.getElementById("timeForm");

setInterval(updateTime, 1000);

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const listEl = document.getElementById("taskList");
console.log(form);

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const task = input.value;

    if(!task){
        alert("Please fill in task");
        return;
    }

    const taskEl = document.createElement("div");
    taskEl.classList.add("task");
    
    const taskContentEl = document.createElement("div");
    taskContentEl.classList.add("content");

    taskEl.appendChild(taskContentEl);

    const taskInputEl = document.createElement("input");
    taskInputEl.classList.add("text");
    taskInputEl.type = "text";
    taskInputEl.value = task;
    tasks.push(taskInputEl.value);
    console.log(tasks);
    taskInputEl.setAttribute("readonly", "readonly");

    taskContentEl.appendChild(taskInputEl);

    const taskActionsEl = document.createElement("div");
    taskActionsEl.classList.add("actions");
    
    const taskEditEl = document.createElement("button");
    taskEditEl.classList.add("edit");
    taskEditEl.innerHTML = "Edit";

    const taskDeleteEl = document.createElement("button");
    taskDeleteEl.classList.add("delete");
    taskDeleteEl.innerHTML = "Delete";

    taskActionsEl.appendChild(taskEditEl);
    taskActionsEl.appendChild(taskDeleteEl);

    taskEl.appendChild(taskActionsEl);

    listEl.appendChild(taskEl);

    console.log("Form submitted");
    input.value = "";

    taskEditEl.addEventListener('click', () => {
        if(taskEditEl.innerText.toLowerCase() == "edit"){
            taskInputEl.removeAttribute("readonly");
            taskInputEl.focus();
            taskEditEl.innerText = "Save";
        }else{
            taskInputEl.setAttribute("readonly", "readonly");
            taskEditEl.innerText = "Edit";
        }
    })

    taskDeleteEl.addEventListener('click', () => {
        tasks.splice(tasks.indexOf(taskInputEl.value),1);
        listEl.removeChild(taskEl);
        console.log(tasks);
    })

})

timeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    enterTime();
})

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
        document.title = `Time Left: ${hours}:${minutes}:${seconds}`;
        time--;
    }else{
        if(!hasEndAlerted && timeEntered == true){
            alert("Time has run out!");
            hasEndAlerted = true;
        }
        timer.innerHTML = "No time left!";
    }
    if(time < 600 & !hasCleanupAlerted & timeEntered == true){
        alert("Time to clean up!");
        hasCleanupAlerted = true;
        timerContainer.style.backgroundColor = "#f00";
    }
}

function enterTime(){
    let curTime = (today.getHours() * 60 * 60) + (today.getMinutes() * 60) + (today.getSeconds());
    let endTime = document.getElementById("timeInput").value;

    if(endTime.includes(":")){
        var tempArray = endTime.split(':'),hours = Number(tempArray[0]), minutes = Number(tempArray[1]);
        if(curTime > 12 * 3600 && hours < 13){
            hours += 12;
        }
        endTime = Number(hours) + (Number(minutes) / 60);
        console.log(hours + " " + minutes / 60);
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


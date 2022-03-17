var today = new Date();
let time; 
let hasEndAlerted = false;
let hasCleanupAlerted = false;
let timeEntered = false;

const timer = document.getElementById('timerNumbers');

setInterval(updateTime, 1000);

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
        timer.innerHTML = `${hours}: ${minutes}: ${seconds}`;
        document.title = `${hours}: ${minutes}: ${seconds}`;
        time--;
    }else if(time < 10 * 60 & !hasCleanupAlerted & timeEntered == true){
        alert("Time to clean up!");
        hasCleanupAlerted = true;
    }else{
        if(!hasEndAlerted && timeEntered == true){
            alert("Time has run out!");
            hasAlerted = true;
        }
        timer.innerHTML = "No time left!";
    }
}

function enterTime(){
    let curTime = (today.getHours() * 60 * 60) + (today.getMinutes() * 60) + (today.getSeconds());
    let endTime = document.getElementById("timeInput").value;
    if(endTime.includes(":")){
        var tempArray = endTime.split(':'),hours = tempArray[0], minutes = tempArray[1];
        endTime = Number(hours) + (Number(minutes) / 60);
        console.log(hours + " " + minutes / 60);
        console.log(endTime);
    }else{
        endTime = document.getElementById("timeInput").value;
        console.log(endTime);
    }
    endTime *= 3600;

    time = endTime - curTime;  
    time = Math.floor(time); 

    if(time < 1){
        alert("Time invalid (already passed)");
        time = 0;
    }else{
        timeEntered = true;
        hasAlerted = false;
    }
}
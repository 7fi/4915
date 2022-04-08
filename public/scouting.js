
let docStyle = getComputedStyle(document.documentElement);
const loadingEl = document.getElementById("loadingEl");

//Name
const nameInput = document.getElementById("nameInput");

//Team number
const teamNumInput = document.getElementById("teamNumInput");

//Match number
const matchNumInput = document.getElementById("matchNumInput");

//Assigned Position
const assignedTL = document.getElementById("assigned1");
const assignedML = document.getElementById("assigned2");
const assignedBL = document.getElementById("assigned3");
const assignedTR = document.getElementById("assigned4");
const assignedMR = document.getElementById("assigned5");
const assignedBR = document.getElementById("assigned6");

//Taxi
const taxiYes = document.getElementById("taxiYes");
const taxiNo = document.getElementById("taxiNo");

//auto high
const autoHighInc = document.getElementById("autoHighInc");
const autoHighDec = document.getElementById("autoHighDec");
const autoHighCount = document.getElementById("autoHighNum");

//auto low
const autoLowInc = document.getElementById("autoLowInc");
const autoLowDec = document.getElementById("autoLowDec");
const autoLowCount = document.getElementById("autoLowNum");

//tele high
const teleHighInc = document.getElementById("teleHighInc");
const teleHighDec = document.getElementById("teleHighDec");
const teleHighCount = document.getElementById("teleHighNum");

//tele low
const teleLowInc = document.getElementById("teleLowInc");
const teleLowDec = document.getElementById("teleLowDec");
const teleLowCount = document.getElementById("teleLowNum");

// time defending
const timeDefend = document.getElementById("timeDefend");

//Climb level
const climb0 = document.getElementById("climb0");
const climb1 = document.getElementById("climb1");
const climb2 = document.getElementById("climb2");
const climb3 = document.getElementById("climb3");
const climb4 = document.getElementById("climb4");

//Penalties
const penaltyCount = document.getElementById("penaltyCount");
const penaltyInc = document.getElementById("penaltyInc");
const penaltyDec = document.getElementById("penaltyDec");

// Potential
const potential1 = document.getElementById("potential1");
const potential2 = document.getElementById("potential2");
const potential3 = document.getElementById("potential3");
const potential4 = document.getElementById("potential4");
const potential5 = document.getElementById("potential5");

//Driving
const driving1 = document.getElementById("driving1");
const driving2 = document.getElementById("driving2");
const driving3 = document.getElementById("driving3");
const driving4 = document.getElementById("driving4");
const driving5 = document.getElementById("driving5");

//Comments
const commentInput = document.getElementById("commentInput");

//submit
const submitButton = document.getElementById("scoutingSubmitButton");

var data = {
    name: "",
    teamNum: 0,
    matchNum: 0,
    assignedPos: "",
    taxi: false,
    autoHighGoals: 0,
    autoLowGoals: 0,
    teleHighGoals: 0,
    teleLowGoals: 0,
    timeDefend: 0,
    climbLevel: 0,
    penalty: 0,
    potential: 0,
    driving: 0,
    comment:""
};
/*
//Name
nameInput.addEventListener('submit', async () => {
    console.log(nameInput.value);
    data.name = nameInput.value;
});
//Team
teamNumInput.addEventListener('submit', async () => {
    data.teamNum = parseInt( teamNumInput.value);
});
//Match
matchNumInput.addEventListener('submit', async () => {
    data.matchNum = parseInt(matchNumInput.value);
});*/

//Assigned pos
assignedTL.addEventListener('click', async () => {
    data.assignedPos = "TL";
    resetAssigned();
    assignedTL.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
assignedML.addEventListener('click', async () => {
    data.assignedPos = "ML";
    resetAssigned();
    assignedML.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
assignedBL.addEventListener('click', async () => {
    data.assignedPos = "BL";
    resetAssigned();
    assignedBL.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
assignedTR.addEventListener('click', async () => {
    data.assignedPos = "TR";
    resetAssigned();
    assignedTR.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
assignedMR.addEventListener('click', async () => {
    data.assignedPos = "MR";
    resetAssigned();
    assignedMR.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
assignedBR.addEventListener('click', async () => {
    data.assignedPos = "BR";
    resetAssigned();
    assignedBR.style.backgroundColor = docStyle.getPropertyValue('--warn');
});

function resetAssigned(){
    assignedTL.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    assignedML.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    assignedBL.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    assignedTR.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    assignedMR.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    assignedBR.style.backgroundColor = docStyle.getPropertyValue('--medLight');
}

//Taxi
taxiYes.addEventListener('click', async () => {
    data.taxi = true;
    resetTaxi();
    taxiYes.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
taxiNo.addEventListener('click', async () => {
    data.assignedPos = false;
    resetTaxi();
    taxiNo.style.backgroundColor = docStyle.getPropertyValue('--warn');
});

function resetTaxi(){
    taxiYes.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    taxiNo.style.backgroundColor = docStyle.getPropertyValue('--medLight');
}

//auto
autoHighInc.addEventListener('click', async () => {
    data.autoHighGoals++;
    autoHighCount.textContent = data.autoHighGoals;
});
autoHighDec.addEventListener('click', async () => {
    data.autoHighGoals--;
    autoHighCount.textContent = data.autoHighGoals;
});
autoLowInc.addEventListener('click', async () => {
    data.autoLowGoals++;
    autoLowCount.textContent = data.autoLowGoals;
});
autoLowDec.addEventListener('click', async () => {
    data.autoLowGoals--;
    autoLowCount.textContent = data.autoLowGoals;
});
//tele
teleHighInc.addEventListener('click', async () => {
    data.teleHighGoals++;
    teleHighCount.textContent = data.teleHighGoals;
});
teleHighDec.addEventListener('click', async () => {
    data.teleHighGoals--;
    teleHighCount.textContent = data.teleHighGoals;
});
teleLowInc.addEventListener('click', async () => {
    data.teleLowGoals++;
    teleLowCount.textContent = data.teleLowGoals;
});
teleLowDec.addEventListener('click', async () => {
    data.teleLowGoals--;
    teleLowCount.textContent = data.teleLowGoals;
});

//Defending Time

//Climbing Level
climb0.addEventListener('click', async () => {
    data.climbLevel = 0;
    resetClimb();
    climb0.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
climb1.addEventListener('click', async () => {
    data.climbLevel = 1;
    resetClimb();
    climb1.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
climb1.addEventListener('click', async () => {
    data.climbLevel = 1;
    resetClimb();
    climb1.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
climb2.addEventListener('click', async () => {
    data.climbLevel = 2;
    resetClimb();
    climb2.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
climb3.addEventListener('click', async () => {
    data.climbLevel = 3;
    resetClimb();
    climb3.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
climb4.addEventListener('click', async () => {
    data.climbLevel = 4;
    resetClimb();
    climb4.style.backgroundColor = docStyle.getPropertyValue('--warn');
});

function resetClimb(){
    climb0.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    climb1.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    climb2.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    climb3.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    climb4.style.backgroundColor = docStyle.getPropertyValue('--medLight');
}

//Penalty points
penaltyInc.addEventListener('click', async () => {
    data.penalty++;
    penaltyCount.textContent = data.penalty;
});
penaltyDec.addEventListener('click', async () => {
    data.penalty--;
    penaltyCount.textContent = data.penalty;
});

//Pontential
potential1.addEventListener('click', async () => {
    data.potential = 1;
    resetPotential();
    potential1.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
potential2.addEventListener('click', async () => {
    data.potential = 2;
    resetPotential();
    potential2.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
potential3.addEventListener('click', async () => {
    data.potential = 3;
    resetPotential();
    potential3.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
potential4.addEventListener('click', async () => {
    data.potential = 4;
    resetPotential();
    potential4.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
potential5.addEventListener('click', async () => {
    data.potential = 5;
    resetPotential();
    potential5.style.backgroundColor = docStyle.getPropertyValue('--warn');
});

function resetPotential(){
    potential1.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    potential2.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    potential3.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    potential4.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    potential5.style.backgroundColor = docStyle.getPropertyValue('--medLight');
}

//Driving rating
driving1.addEventListener('click', async () => {
    data.driving = 1;
    resetDriving();
    driving1.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
driving2.addEventListener('click', async () => {
    data.driving = 2;
    resetDriving();
    driving2.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
driving3.addEventListener('click', async () => {
    data.driving = 3;
    resetDriving();
    driving3.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
driving4.addEventListener('click', async () => {
    data.driving = 4;
    resetDriving();
    driving4.style.backgroundColor = docStyle.getPropertyValue('--warn');
});
driving5.addEventListener('click', async () => {
    data.driving = 5;
    resetDriving();
    driving5.style.backgroundColor = docStyle.getPropertyValue('--warn');
});

function resetDriving(){
    driving1.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    driving2.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    driving3.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    driving4.style.backgroundColor = docStyle.getPropertyValue('--medLight');
    driving5.style.backgroundColor = docStyle.getPropertyValue('--medLight');
}

/*
//Match comments:
commentInput.addEventListener('submit', async () => {
    data.commentInput = commentInput.value;
});*/

submitButton.addEventListener('click', async () => {
    data.name = nameInput.value;
    data.teamNum = parseInt( teamNumInput.value);
    data.matchNum = parseInt(matchNumInput.value);
    data.comment = commentInput.value;

    console.log(data);
    
    options = {method:"POST",headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
    };
    loadingEl.style.display ='block';
    const response = await fetch('/submitScoutingData', options);
    const json = await response.json();
    loadingEl.style.display ='none';

    alert("Data Submitted!");

    location.reload();
});



const { response } = require('express');
const express = require('express');
// const Datastore = require('nedb');
// const {google} = require('googleapis');
// const keys = require('./keys.json');
const sseMW = require('./sse');
// var http = require('http');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

// const EtasksDB = new Datastore('Etasks.db');
// const MtasksDB = new Datastore('Etasks.db');
// const PtasksDB = new Datastore('Etasks.db');

// EtasksDB.loadDatabase();
// MtasksDB.loadDatabase();
// PtasksDB.loadDatabase();
var Etasks = [];
var Mtasks = [];
var Ptasks = [];

var endTime;

var data = [];
/* for local use 
const client = new google.auth.JWT(
    keys.client_email, 
    null, 
    keys.private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);*/

/*const client = new google.auth.JWT(
    process.env.client_email, 
    null, 
    process.env.private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(err,tokens){
    if(err){
        console.log(err);
        return;
    }else{
        console.log("Connected");
        // teams = gsrun(client, "'Analysis'!U2:U35");
        // scores = gsrun(client, "'Analysis'!V2:V107");
    }
});*/

async function gsrun(cl, range){
    const gsapi = google.sheets({version:'v4', auth: cl});

    var opt = { // 19b3SCivuMRup48d0L-UUBl0bGGbNWhJcgnO01dD2K0E 
        spreadsheetId: '1HRpgBTLoaA9l8Lt7eAdSMMnBnzIbfZMAER-OUR9lNrA',
        range: range
    };

    let data = await gsapi.spreadsheets.values.get(opt);
    return data.data.values;

    /*teams = data.data.values;
    
    opt.range = "'Analysis'!V2:V107"
    
    data = await gsapi.spreadsheets.values.get(opt);
    scores = data.data.values;*/
    // console.log(data.data.values);
} 

// Realtime updates
var sseClients = new sseMW.Topic();
 
//configure sseMW.sseMiddleware as function to get a stab at incoming requests, in this case by adding a Connection property to the request
app.use(sseMW.sseMiddleware)

app.get('/updates', function (req, res) {
    console.log("res (should have sseConnection)= " + res.sseConnection);
    var sseConnection = res.sseConnection;
    console.log("sseConnection= ");
    sseConnection.setup();
    sseClients.add(sseConnection);
});

//Creating, moving, and deleting tasks
app.post('/newTask', (request,response) => {
    var data = request.body;
    const newTask = {task: data.value, assignedTo: "Everyone"};
    var tasks;
    var page;
    if(request.rawHeaders.join().includes('electronics')){
        Etasks.push(newTask);
        response.json({
            status:"sucess",
            tasks: Etasks
        })
        tasks = Etasks;
        page = "electronics";
    }else if(request.rawHeaders.join().includes('mechanics')){
        Mtasks.push(newTask);
        response.json({
            status:"sucess",
            tasks: Mtasks
        })
        tasks = Mtasks;
        page = "mechanics";
    }else if(request.rawHeaders.join().includes('programming')){
        Ptasks.push(newTask);
        response.json({
            status:"sucess",
            tasks: Ptasks
        })
        tasks = Ptasks;
        page = "programming";
    }

    sseClients.forEach(function (sseConnection) {
        var data = {data:tasks, target: "tasks", page: page};
        sseConnection.send(data);
    }, this);
});

app.post('/editTask', (request,response) => {
    var data = request.body;
    var tasks;
    var page; 
    if(request.rawHeaders.join().includes('electronics')){
        console.log("data index: " + data.index);
        Etasks[data.index].task = data.value;
        response.json({
            status:"sucess",
            tasks: Etasks
        })
        tasks = Etasks;
        page = "electronics";
    }else if(request.rawHeaders.join().includes('mechanics')){
        Mtasks[data.index].task = data.value;
        response.json({
            status:"sucess",
            tasks: Mtasks
        })
        tasks = Mtasks;
        page = "mechanics";
    }else if(request.rawHeaders.join().includes('programming')){
        Ptasks[data.index].task = data.value;
        response.json({
            status:"sucess",
            tasks: Ptasks
        })
        tasks = Ptasks;
        page = "programming";
    }

    sseClients.forEach(function (sseConnection) {
        var data = {data:tasks, target: "tasks", page:page};
        sseConnection.send(data);
    }, this);
});

app.post('/delTask', (request,response) => {
    var data = request.body;
    var tasks;
    var page;
    if(request.rawHeaders.join().includes('electronics')){
        Etasks.pop(Etasks[Etasks.includes(data.value)]);
        response.json({
            status:"sucess",
            tasks: Etasks
        })
        tasks = Etasks;
        page = "electronics";
    }else if(request.rawHeaders.join().includes('mechanics')){
        Mtasks.pop(Mtasks[Mtasks.indexOf(data.value)]);
        response.json({
            status:"sucess",
            tasks: Mtasks
        })
        tasks = Mtasks;
        page = "mechanics";
    }else if(request.rawHeaders.join().includes('programming')){
        Ptasks.pop(Ptasks[Ptasks.indexOf(data.value)]);
        response.json({
            status:"sucess",
            tasks: Ptasks
        })
        tasks = Ptasks;
        page = "programming";
    }

    sseClients.forEach(function (sseConnection) {
        var data = {data:tasks, target: "tasks", page: page};
        sseConnection.send(data);
    }, this);
});

app.post('/moveTask', (request,response) => {
    var data = request.body;
    var tasks;
    var page;
    if(request.rawHeaders.join().includes('electronics')){
        Etasks = data;
        response.json({
            status:"sucess",
            tasks: Etasks
        })
        page = "electronics";
    }else if(request.rawHeaders.join().includes('mechanics')){
        Mtasks = data;
        response.json({
            status:"sucess",
            tasks: Mtasks
        })
        page = "mechanics";
    }else if(request.rawHeaders.join().includes('programming')){
        Ptasks = data;
        response.json({
            status:"sucess",
            tasks: Ptasks
        })
        page = "programming";
    }
    sseClients.forEach(function (sseConnection) {
        var sendData = {data:data, target: "tasks", page: page};
        sseConnection.send(sendData);
    }, this);
});

app.post('/changeAssign', (request,response) => {
    var data = request.body;
    var tasks;
    var page = "";
    if(request.rawHeaders.join().includes('electronics')){
        var taskClone = [];
        for (let i = 0; i < Etasks.length; i++) {
            taskClone[i] = Etasks[i].task;
        }
        console.log(data.parent, taskClone);
        console.log(taskClone.indexOf(data.parent));
        Etasks[taskClone.indexOf(data.parent)].assignedTo = data.value;
        response.json({
            status:"sucess",
            tasks: Etasks
        })
        tasks = Etasks;
        page = "electronics";
        console.log(Etasks);
    }else if(request.rawHeaders.join().includes('mechanics')){
        var taskClone = [];
        for (let i = 0; i < Mtasks.length; i++) {
            taskClone[i] = Mtasks.task;
        }
        Mtasks[taskClone.indexOf(data.parent)].assignedTo = data.value;
        response.json({
            status:"sucess",
            tasks: Mtasks
        })
        tasks = Mtasks;
        page = "mechanics";
    }else if(request.rawHeaders.join().includes('programming')){
        var taskClone = [];
        for (let i = 0; i < Ptasks.length; i++) {
            taskClone[i] = Ptasks.task;
        }
        Ptasks[taskClone.indexOf(data.parent)].assignedTo = data.value;
        response.json({
            status:"sucess",
            tasks: Ptasks
        })
        tasks = Ptasks;
        page = "programming";
    }
    sseClients.forEach(function (sseConnection) {
        var sendData = {data:tasks, target: "tasks", page: page};
        sseConnection.send(sendData);
    }, this);
});

app.post('/setTime', (request,response) => {
    console.log(endTime);
    endTime = request.body.value;
    console.log("Set time to " + endTime);
    response.json({
        status:"sucess",
        endTime: endTime
    })

    sseClients.forEach(function (sseConnection) {
        var sendData = {data:endTime, target: "endTime"};
        sseConnection.send(sendData);
    }, this);
});

app.post('/getData', async(request, response) => {
    let teams = await gsrun(client, "'Analysis'!A2:A32");
    let scores;
    console.log(request.body.value);
    
    if(request.body.value == 'teleop'){
        scores = await gsrun(client, "'Analysis'!V2:V32");
        
    }else if(request.body.value == 'auto'){
        scores = await gsrun(client, "'Analysis'!AF2:AF32");
    }

    response.json({
        status:"sucess",
        scores: scores,
        teams: teams
    });
});

// Update tasks, and time
app.get('/updateTasks', (request, response) => {
    if(request.rawHeaders.join().includes('electronics')){
        response.json({
            status:"sucess",
            tasks: Etasks,
            endTime: endTime
        })
    }else if(request.rawHeaders.join().includes('mechanics')){
        response.json({
            status:"sucess",
            tasks: Mtasks,
            endTime: endTime
        })
    }else if(request.rawHeaders.join().includes('programming')){
        response.json({
            status:"sucess",
            tasks: Ptasks,
            endTime: endTime
        })
    }else{
        response.json({
            status:"sucess",
            endTime: endTime
        })
    }
});



// app.get('/getTime', (request, response) => {
//     response.json({
//         status:"sucess",
//         endTime: endTime
//     })
// });

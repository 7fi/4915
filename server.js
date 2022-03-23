const { response } = require('express');
const express = require('express');
const Datastore = require('nedb');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
// database.loadDatabase();
var Etasks = [];
var Mtasks = [];
var Ptasks = [];

var endTime;

//Creating, moving, and deleting tasks
app.post('/newTask', (request,response) => {
    var data = request.body;
    if(request.rawHeaders.join().includes('electronics')){
        Etasks.push(data.value);
        response.json({
            status:"sucess",
            tasks: Etasks
        })
    }else if(request.rawHeaders.join().includes('mechanics')){
        Mtasks.push(data.value);
        response.json({
            status:"sucess",
            tasks: Mtasks
        })
    }else if(request.rawHeaders.join().includes('programming')){
        Ptasks.push(data.value);
        response.json({
            status:"sucess",
            tasks: Ptasks
        })
    }
});

app.post('/editTask', (request,response) => {
    var data = request.body;
    if(request.rawHeaders.join().includes('electronics')){
        Etasks[data.index] = data.value;
        response.json({
            status:"sucess",
            tasks: Etasks
        })
    }else if(request.rawHeaders.join().includes('mechanics')){
        Mtasks[data.index] = data.value;
        response.json({
            status:"sucess",
            tasks: Mtasks
        })
    }else if(request.rawHeaders.join().includes('programming')){
        Ptasks[data.index] = data.value;
        response.json({
            status:"sucess",
            tasks: Ptasks
        })
    }
});

app.post('/delTask', (request,response) => {
    var data = request.body;
    if(request.rawHeaders.join().includes('electronics')){
        Etasks.pop(Etasks[Etasks.indexOf(data.value)]);
        response.json({
            status:"sucess",
            tasks: Etasks
        })
    }else if(request.rawHeaders.join().includes('mechanics')){
        Mtasks.pop(Mtasks[Mtasks.indexOf(data.value)]);
        response.json({
            status:"sucess",
            tasks: Mtasks
        })
    }else if(request.rawHeaders.join().includes('programming')){
        Ptasks.pop(Ptasks[Ptasks.indexOf(data.value)]);
        response.json({
            status:"sucess",
            tasks: Ptasks
        })
    }
});

app.post('/moveTask', (request,response) => {
    var data = request.body;
    if(request.rawHeaders.join().includes('electronics')){
        Etasks = data;
        response.json({
            status:"sucess",
            tasks: Etasks
        })
    }else if(request.rawHeaders.join().includes('mechanics')){
        Mtasks = data;
        response.json({
            status:"sucess",
            tasks: Mtasks
        })
    }else if(request.rawHeaders.join().includes('programming')){
        Ptasks = data;
        response.json({
            status:"sucess",
            tasks: Ptasks
        })
    }
});

app.post('/setTime', (request,response) => {
    console.log(endTime);
    endTime = request.body.value;
    console.log("Set time to " + endTime);
    response.json({
        status:"sucess",
        endTime: endTime
    })
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
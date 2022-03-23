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

var endTime;

app.post('/newTask', (request,response) => {
    var data = request.body;
    // console.log(request.rawHeaders);
    if(request.rawHeaders.join().includes('electronics')){
        console.log("something is recieved")
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
    }
});
app.post('/setTime', (request,response) => {
    endTime = request.body.value;
    console.log(endTime);
    response.json({
        status:"sucess",
        endTime: endTime
    })
});

app.get('/updatetasks', (request, response) => {
    if(request.rawHeaders.join().includes('electronics')){
        response.json({
            status:"sucess",
            tasks: Etasks
        })
    }else if(request.rawHeaders.join().includes('mechanics')){
        response.json({
            status:"sucess",
            tasks: Mtasks
        })
    }
});

app.get('/getTime', (request, response) => {
    response.json({
        status:"sucess",
        endTime: endTime
    })
});
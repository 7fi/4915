require('dotenv').config();
const express = require('express');
// const Datastore = require('nedb');
// const mongoose = require('mongoose'); 
const MongoClient = require("mongodb").MongoClient;
const sseMW = require('./sse');
// const {google} = require('googleapis');
// const keys = require('./keys.json');
// var http = require('http');

//process.env.DATABASE_URL mongodb://localhost/tasks
// mongoose.connect('mongodb+srv://7fi:Mrspyman1@7devcluster.zh7gg.mongodb.net/7dev-taskManager?retryWrites=true&w=majority', {useNewUrlParser:true});
// const db = mongoose.connection;
// db.once('open', () => console.log("Connceted to DB"));
// db.on('error', (error) => console.log(error));
// const tasksRouter = require('./routes/tasks');



const client = new MongoClient('mongodb+srv://7fi:Mrspyman1@7devcluster.zh7gg.mongodb.net/7dev-taskManager?retryWrites=true&w=majority');
client.connect();
const database = client.db('7dev-taskManager');
const db = database.collection('tasks');

async function run() {
  try {
    await client.connect();
    // const database = client.db('7dev-taskManager');
    // const db = database.collection('tasks');
    // Query for a movie that has the title 'Back to the Future'
    // const query = { title: 'Back to the Future' };
    // const movie = await movies.findOne(query);
    // console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// run().catch(console.dir);

const app = express();
// app.use('/tasks', tasksRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

// const db = new Datastore('tasks.db');

// db.loadDatabase();
// db.persistence.setAutocompactionInterval(30000);

var Etasks = [];    
var Mtasks = [];
var Ptasks = [];

var endTime;

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

function pushClientTasks(page, tasks){
    sseClients.forEach(function (sseConnection) {
        var data = {data:tasks, target: "tasks", page: page};
        sseConnection.send(data);
    }, this);
}

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
    var newTask = {type: "",task: data.value, assignedTo: "Everyone", index: 0};
    if(request.rawHeaders.join().includes('electronics')){

        newTask.type = 'electronics';
        db.find({type:'electronics'},function (err, docs){
            newTask.index = docs.length;
        });
        db.insert(newTask);
        db.find({type:'electronics'}).sort({index: 1}).exec(function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('electronics', docs);
        });
    }else if(request.rawHeaders.join().includes('mechanics')){

        newTask.type = 'mechanics';
        db.find({type:'mechanics'},function (err, docs){
            newTask.index = docs.length;
        });
        db.insert(newTask);
        db.find({type:'mechanics'}).sort({index: 1}).exec(function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('mechanics', docs);
        });
    }else if(request.rawHeaders.join().includes('programming')){

        newTask.type = 'programming';
        db.find({type:'programming'},function (err, docs){
            newTask.index = docs.length;
        });
        db.insert(newTask);
        db.find({type:'programming'}).sort({index: 1}).exec(function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('programming', docs);
        });
    }
});

app.post('/editTask', (request,response) => {
    var data = request.body;
    var tasks;
    if(request.rawHeaders.join().includes('electronics')){

        db.update({type:"electronics", index: data.index}, {$set: { task: data.value }}, {});
        db.find({type:'electronics'}).sort({index: 1}).exec(function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('electronics', docs);
        });

    }else if(request.rawHeaders.join().includes('mechanics')){
        db.update({type:"mechanics", index: data.index}, {$set: { task: data.value }}, {});
        db.find({type:'mechanics'}).sort({index: 1}).exec(function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('mechanics', docs);
        });
    }else if(request.rawHeaders.join().includes('programming')){
        db.update({type:"programming", index: data.index}, {$set: { task: data.value }}, {});
        db.find({type:'programming'}).sort({index: 1}).exec(function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('programming', docs);
        });
    }
});

app.post('/delTask', (request,response) => {
    var data = request.body;
    if(request.rawHeaders.join().includes('electronics')){
        db.find({type:'electronics'},function (err, docs){
            for (let i = data.index + 1; i < docs.length; i++) {
                db.update({type:"electronics", index: i}, {$set: { index: i - 1 }}, {});
            }
        });

        db.remove({type: 'electronics', task: data.value}, {});
        db.find({type:'electronics'},function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('electronics', docs);
        });
    }else if(request.rawHeaders.join().includes('mechanics')){
        db.find({type:'mechanics'},function (err, docs){
            for (let i = data.index + 1; i < docs.length; i++) {
                db.update({type:"mechanics", index: i}, {$set: { index: i - 1 }}, {});
            }
        });
        db.remove({type: 'mechanics', task: data.value}, {});
        db.find({type:'mechanics'},function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('mechanics', docs);
        });
    }else if(request.rawHeaders.join().includes('programming')){
        db.find({type:'programming'},function (err, docs){
            for (let i = data.index + 1; i < docs.length; i++) {
                db.update({type:"programming", index: i}, {$set: { index: i - 1 }}, {});
            }
        });
        db.remove({type: 'programming', task: data.value}, {});
        db.find({type:'programming'},function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('programming', docs);
        });
    }
});

app.post('/moveTask', (request,response) => {
    var data = request.body;
    if(request.rawHeaders.join().includes('electronics')){
        db.remove({type: 'electronics'}, { multi: true }, function (err, numRemoved) {});
        for (let i = 0; i < data.length; i++) {
            db.insert(data[i]);
        }
        Etasks = data;
        response.json({
            status:"sucess",
            tasks: Etasks
        })
        pushClientTasks('electronics', Etasks);
    }else if(request.rawHeaders.join().includes('mechanics')){
        db.remove({type: 'mechanics'}, { multi: true }, function (err, numRemoved) {});
        for (let i = 0; i < data.length; i++) {
            db.insert(data[i]);
        }
        Mtasks = data;
        response.json({
            status:"sucess",
            tasks: Mtasks
        })
        pushClientTasks('mechanics', Mtasks);
    }else if(request.rawHeaders.join().includes('programming')){
        db.remove({type: 'programming'}, { multi: true }, function (err, numRemoved) {});
        for (let i = 0; i < data.length; i++) {
            db.insert(data[i]);
        }
        Ptasks = data;
        response.json({
            status:"sucess",
            tasks: Ptasks
        })
        pushClientTasks('programming', Ptasks);
    }
});

app.post('/changeAssign', (request,response) => {
    var data = request.body;
    var tasks;
    var page = "";
    if(request.rawHeaders.join().includes('electronics')){
        db.update({type:'electronics', task: data.parent},{ $set: { assignedTo: data.value } }, {});
        db.find({type:'electronics'}).sort({index: 1}).exec(function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('electronics', docs);
        });
    }else if(request.rawHeaders.join().includes('mechanics')){
        db.update({type:'mechanics', task: data.parent},{ $set: { assignedTo: data.value } }, {});
        db.find({type:'mechanics'}).sort({index: 1}).exec(function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('mechanics', docs);
        });
    }else if(request.rawHeaders.join().includes('programming')){
        db.update({type:'programming', task: data.parent},{ $set: { assignedTo: data.value } }, {});
        db.find({type:'programming'}).sort({index: 1}).exec(function (err, docs){
            response.json({
                status:"sucess",
                tasks: docs
            })
            pushClientTasks('programming', docs);
        });
    }
});

app.post('/setTime', (request,response) => {
    // console.log(endTime);
    endTime = request.body.value;
    db.remove({type:'time'},{ multi: true });
    db.insert({type:'time', endTime: endTime}, function(err, insertedDoc){
        console.log("Set time to " + insertedDoc.endTime);
        response.json({
            status:"sucess",
            endTime: endTime
        })
    });

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
        db.find({type:'electronics'}).sort({index: 1}).exec(function (err, docs){
            console.log(docs);
            Etasks = docs;
        });
        db.find({type:'time'},function (err, docs){
            console.log(docs)
            var tempEndTime = undefined;
            if(docs.length > 0){
                tempEndTime = docs[0].endTime;
            }
            response.json({
                status:"sucess",
                tasks: Etasks,
                endTime: tempEndTime
            })
        });
    }else if(request.rawHeaders.join().includes('mechanics')){
        db.find({type:'mechanics'}).sort({index: 1}).exec(function (err, docs){
            Mtasks = docs;
        });
        db.find({type:'time'},function (err, docs){
            var tempEndTime = undefined;
            if(docs.length > 0){
                tempEndTime = docs[0].endTime;
            }
            response.json({
                status:"sucess",
                tasks: Mtasks,
                endTime: tempEndTime
            })
        });
    }else if(request.rawHeaders.join().includes('programming')){
        db.find({type:'programming'}).sort({index: 1}).exec(function (err, docs){
            Ptasks = docs;
        });
        db.find({type:'time'},function (err, docs){
            var tempEndTime = undefined;
            if(docs.length > 0){
                tempEndTime = docs[0].endTime;
            }
            response.json({
                status:"sucess",
                tasks: Ptasks,
                endTime: tempEndTime
            })
        });
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

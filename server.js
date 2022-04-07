const express = require('express');
const mongoose = require('mongoose'); 
const sseMW = require('./sse');
// const keys = require('./keys.json');

const Task = require('./models/task');
const Time = require('./models/time');

const app = express();

const port = process.env.PORT || 3000;

//process.env.DATABASE_URL || keys.DATABASE_URL
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true});
const db = mongoose.connection;
db.once('open', () => app.listen(port, () => console.log(`Starting server at ${port}`)));
db.on('error', (error) => console.log(error));

app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

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
    // console.log("res (should have sseConnection)= " + res.sseConnection);
    var sseConnection = res.sseConnection;
    sseConnection.setup();
    sseClients.add(sseConnection);
});

//Creating, moving, and deleting tasks
app.post('/newTask', (request,response) => {
    var data = request.body;
    var newTask = {type: "",task: data.value, assignedTo: "Everyone", index: 0};
    if(request.rawHeaders.join().includes('electronics')){

        Task.find({type:'electronics'}, async function (err, docs){
            newTask.type = 'electronics';
            newTask.index = docs.length;

            const saverTask = new Task(newTask);
            await saverTask.save();

            Task.find({type:'electronics'}).sort({index: 1}).exec(function (err, docs){
                response.sendStatus(201);
                pushClientTasks('electronics', docs);
            });
        });
        
    }else if(request.rawHeaders.join().includes('team')){

        Task.find({type:'team'}, async function (err, docs){
            newTask.type = 'team';
            newTask.index = docs.length;
            const saverTask = new Task(newTask);
            await saverTask.save();
            Task.find({type:'team'}).sort({index: 1}).exec(function (err, docs){
                response.sendStatus(201);
                pushClientTasks('team', docs);
            });
        });
        
    }else if(request.rawHeaders.join().includes('mechanics')){

        Task.find({type:'mechanics'}, async function (err, docs){
            newTask.type = 'mechanics';
            newTask.index = docs.length;
            const saverTask = new Task(newTask);
            await saverTask.save();
            Task.find({type:'mechanics'}).sort({index: 1}).exec(function (err, docs){
                response.sendStatus(201);
                pushClientTasks('mechanics', docs);
            });
        });
        
    }else if(request.rawHeaders.join().includes('programming')){

        Task.find({type:'programming'}, async function (err, docs){
            newTask.type = 'programming';
            newTask.index = docs.length;
            const saverTask = new Task(newTask);
            await saverTask.save();
            Task.find({type:'programming'}).sort({index: 1}).exec(function (err, docs){
                response.sendStatus(201);
                pushClientTasks('programming', docs);
            });
        });
    }
});

app.post('/editTask', (request,response) => {
    var data = request.body;
    var tasks;
    if(request.rawHeaders.join().includes('electronics')){

        Task.updateOne({type:"electronics", index: data.index}, {$set: { task: data.value }}, {}, function(err,docs){
            console.log("edited docs: ", docs);
            Task.find({type:'electronics'}).sort({index: 1}).exec(function (err, docs){
                response.json({
                    status:"sucess",
                    tasks: docs
                })
                pushClientTasks('electronics', docs);
            });
        });
        

    }else if(request.rawHeaders.join().includes('team')){
        Task.updateOne({type:"team", index: data.index}, {$set: { task: data.value }}, {}, function(err,docs){
            Task.find({type:'team'}).sort({index: 1}).exec(function (err, docs){
                response.json({
                    status:"sucess",
                    tasks: docs
                })
                pushClientTasks('team', docs);
            });
        });
        
    }else if(request.rawHeaders.join().includes('mechanics')){
        Task.updateOne({type:"mechanics", index: data.index}, {$set: { task: data.value }}, {}, function(err,docs){
            Task.find({type:'mechanics'}).sort({index: 1}).exec(function (err, docs){
                response.json({
                    status:"sucess",
                    tasks: docs
                })
                pushClientTasks('mechanics', docs);
            });
        });
        
    }else if(request.rawHeaders.join().includes('programming')){
        Task.updateOne({type:"programming", index: data.index}, {$set: { task: data.value }}, {}, function(err,docs){
            Task.find({type:'programming'}).sort({index: 1}).exec(function (err, docs){
                response.json({
                    status:"sucess",
                    tasks: docs
                })
                pushClientTasks('programming', docs);
            });
        });
    }
});

app.delete('/delTask', (request,response) => {
    var data = request.body;
    if(request.rawHeaders.join().includes('electronics')){
        Task.find({type:'electronics'},async function (err, docs){
            for (let i = data.index + 1; i < docs.length; i++) {
                await Task.updateOne({type:"electronics", index: i}, {$set: { index: i - 1 }}, {});
            }
            Task.deleteOne({type: 'electronics', task: data.value}, {}, function(err,docs){
                Task.find({type:'electronics'},function (err, docs){
                    response.json({
                        status:"sucess",
                        tasks: docs
                    })
                    pushClientTasks('electronics', docs);
                });
            });
        });

        
    }else if(request.rawHeaders.join().includes('team')){
        Task.find({type:'team'}, async function (err, docs){
            for (let i = data.index + 1; i < docs.length; i++) {
                await Task.updateOne({type:"team", index: i}, {$set: { index: i - 1 }}, {});
            }
            Task.deleteOne({type: 'team', task: data.value}, {}, function(err,docs){
                Task.find({type:'team'},function (err, docs){
                    response.json({
                        status:"sucess",
                        tasks: docs
                    })
                    pushClientTasks('team', docs);
                });
            });
        });
        
    }else if(request.rawHeaders.join().includes('mechanics')){
        Task.find({type:'mechanics'}, async function (err, docs){
            for (let i = data.index + 1; i < docs.length; i++) {
                await Task.updateOne({type:"mechanics", index: i}, {$set: { index: i - 1 }}, {});
            }
            Task.deleteOne({type: 'mechanics', task: data.value}, {}, function(err,docs){
                Task.find({type:'mechanics'},function (err, docs){
                    response.json({
                        status:"sucess",
                        tasks: docs
                    })
                    pushClientTasks('mechanics', docs);
                });
            });
        });
        
    }else if(request.rawHeaders.join().includes('programming')){
        Task.find({type:'programming'}, async function (err, docs){
            for (let i = data.index + 1; i < docs.length; i++) {
                await Task.updateOne({type:"programming", index: i}, {$set: { index: i - 1 }}, {});
            }
            Task.deleteOne({type: 'programming', task: data.value}, {}, function(err,docs){
                Task.find({type:'programming'},function (err, docs){
                    response.json({
                        status:"sucess",
                        tasks: docs
                    })
                    pushClientTasks('programming', docs);
                });
            });
        });
    }
});

app.post('/moveTask', (request,response) => {
    var data = request.body;
    var tasks;
    if(request.rawHeaders.join().includes('electronics')){
        Task.remove({type: 'electronics'}, { multi: true }, async function (err, numRemoved) {
            for (let i = 0; i < data.length; i++) {
                const tempTask = new Task(data[i]);
                await tempTask.save();
            }
            tasks = data;
            response.json({
                status:"sucess",
                tasks: tasks
            }).status(200);

            pushClientTasks('electronics', tasks);
        });
       
    }else if(request.rawHeaders.join().includes('team')){
        Task.remove({type: 'team'}, { multi: true }, async function (err, numRemoved) {
            for (let i = 0; i < data.length; i++) {
                const tempTask = new Task(data[i]);
                await tempTask.save();
            }
            tasks = data;
            response.json({
                status:"sucess",
                tasks: tasks
            }).status(200);
            pushClientTasks('team', tasks);
        });
        
    }else if(request.rawHeaders.join().includes('mechanics')){
        Task.remove({type: 'mechanics'}, { multi: true }, async function (err, numRemoved) {
            for (let i = 0; i < data.length; i++) {
                const tempTask = new Task(data[i]);
                await tempTask.save();
            }
            tasks = data;
            response.json({
                status:"sucess",
                tasks: tasks
            }).status(200);
            pushClientTasks('mechanics', tasks);
        });
        
    }else if(request.rawHeaders.join().includes('programming')){
        Task.remove({type: 'programming'}, { multi: true }, async function (err, numRemoved) {
            for (let i = 0; i < data.length; i++) {
                const tempTask = new Task(data[i]);
                await tempTask.save();
            }
            tasks = data;
            response.json({
                status:"sucess",
                tasks: tasks
            })
            pushClientTasks('programming', tasks);
        });
    }
});

app.post('/changeAssign', (request,response) => {
    var data = request.body;
    var tasks;
    var page = "";
    if(request.rawHeaders.join().includes('electronics')){
        Task.updateOne({type:'electronics', task: data.parent},{ $set: { assignedTo: data.value } }, {}, function(err,docs){
            Task.find({type:'electronics'}).sort({index: 1}).exec(function (err, docs){
                response.json({
                    status:"sucess",
                    tasks: docs
                }).status(200);
                pushClientTasks('electronics', docs);
            });
        });
        
    }else if(request.rawHeaders.join().includes('team')){
        Task.updateOne({type:'team', task: data.parent},{ $set: { assignedTo: data.value } }, {}, function(err,docs){
            Task.find({type:'team'}).sort({index: 1}).exec(function (err, docs){
                response.json({
                    status:"sucess",
                    tasks: docs
                })
                pushClientTasks('team', docs);
            });
        });
    }else if(request.rawHeaders.join().includes('mechanics')){
        Task.updateOne({type:'mechanics', task: data.parent},{ $set: { assignedTo: data.value } }, {}, function(err,docs){
            Task.find({type:'mechanics'}).sort({index: 1}).exec(function (err, docs){
                response.json({
                    status:"sucess",
                    tasks: docs
                })
                pushClientTasks('mechanics', docs);
            });
        });
    }else if(request.rawHeaders.join().includes('programming')){
        Task.updateOne({type:'programming', task: data.parent},{ $set: { assignedTo: data.value } }, {}, function(err,docs){
            Task.find({type:'programming'}).sort({index: 1}).exec(function (err, docs){
                response.json({
                    status:"sucess",
                    tasks: docs
                })
                pushClientTasks('programming', docs);
            });
        });
    }
});

app.post('/setTime', async (request,response) => {
    var endTime = request.body.value;
    await Time.deleteMany({type:'time'},{ multi: true });

    const tempTime = new Time({type:'time', endTime: endTime});
    await tempTime.save();

    response.json({
        status:"sucess",
        endTime: endTime
    }).status(201);

    sseClients.forEach(function (sseConnection) {
        var sendData = {data:endTime, target: "endTime"};
        sseConnection.send(sendData);
    }, this);
});

// Update tasks, and time
app.get('/updateTasks', (request, response) => {
    var tasks;
    if(request.rawHeaders.join().includes('electronics')){
        Task.find({type:'electronics'}).sort({index: 1}).exec(function (err, docs){
            console.log(docs);
            tasks = docs;

            Time.find({type:'time'},async function (err, docs){
                console.log(docs)
                var tempEndTime = undefined;
                if(docs.length > 0){
                    tempEndTime = await docs[0].endTime;
                }
                response.json({
                    status:"sucess",
                    tasks: tasks,
                    endTime: tempEndTime
                }).status(200);
            });
        });
        
    }else if(request.rawHeaders.join().includes('team')){
        Task.find({type:'team'}).sort({index: 1}).exec(function (err, docs){
            tasks = docs;

            Time.find({type:'time'},async function (err, docs){
                var tempEndTime = undefined;
                if(docs.length > 0){
                    tempEndTime = await docs[0].endTime;
                }
                response.json({
                    status:"sucess",
                    tasks: tasks,
                    endTime: tempEndTime
                })
            });
        });
        
    }else if(request.rawHeaders.join().includes('mechanics')){
        Task.find({type:'mechanics'}).sort({index: 1}).exec(function (err, docs){
            tasks = docs;

            Time.find({type:'time'},async function (err, docs){
                var tempEndTime = undefined;
                if(docs.length > 0){
                    tempEndTime = await docs[0].endTime;
                }
                response.json({
                    status:"sucess",
                    tasks: tasks,
                    endTime: tempEndTime
                })
            });
        });
        
    }else if(request.rawHeaders.join().includes('programming')){
        Task.find({type:'programming'}).sort({index: 1}).exec(function (err, docs){
            tasks = docs;
            Time.find({type:'time'},async function (err, docs){
                var tempEndTime = undefined;
                if(docs.length > 0){
                    tempEndTime = await docs[0].endTime;
                }
                response.json({
                    status:"sucess",
                    tasks: tasks,
                    endTime: tempEndTime
                })
            });
        });
       
    }else{
        Time.find({type:'time'},async function (err, docs){
            var tempEndTime = undefined;
            if(docs.length > 0){
                tempEndTime = await docs[0].endTime;
            }
            response.json({
                status:"sucess",
                endTime: tempEndTime
            })
        });
    }
});
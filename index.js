const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

//Global Middleware
function logRequests(req, res, next) {
    console.count("Requisition counter");
    next();
}
server.use(logRequests);

//Local Middleware
function CheckProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
    if(!project){
        return res.status(400).json({ error: `Project ID ${id} does not exists.` })
    }
    next();
}

// Get all projects
server.get('/projects', (req, res) => {
    return res.json(projects);
})

//Create new project
server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    }
    projects.push(project);

    return res.json(projects);
})

//Create new project task
server.post('/projects/:id/tasks', CheckProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    //Find project
    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(projects);
})

//Update project title
server.put('/projects/:id', CheckProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(projects);
})

//Delete project
server.delete('/projects/:id', CheckProjectExists, (req, res) => {
    const { id } = req.params;

    const project = projects.find(p => p.id == id);

    projects.splice(project.index, 1);

    return res.send();
})

server.listen(3000);
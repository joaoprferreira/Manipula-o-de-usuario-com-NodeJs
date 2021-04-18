const { request, response } = require("express");
const express = require("express");
const { isUuid, uuid } = require("uuidv4");

const app = express();

app.use(express.json());

const projects = [];

function logRequest(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()} ${url}]`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(404).json({ error : "User Id Invalid"})
  }

  return next();
}

app.use(logRequest);

app.get("/projects", (request, response) => {
  const { title } = request.query;

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;

  return response.json(results);
});

app.post("/projects/:id", (request, response) => {
  const { title, owner, name, location, age } = request.body;

  const project = {
    id: uuid(),
    name,
    location,
    age,
    title,
    owner,
  };

  projects.push(project);

  return response.json(project);
});

app.put("/projects/:id", validateProjectId,(request, response) => {
  const { id } = request.params;
  const { title, owner, name, location, age } = request.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({
      error: "Project not found.",
    });
  }

  const project = {
    id,
    title,
    owner,
    name,
    location,
    age,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete("/projects/:id", validateProjectId,(request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({
      error: "Project not found.",
    });
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log("Back-end Started ! <3");
});

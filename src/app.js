/**
 * 
 * Início do desafio em: 20/08/2020
 * 
 * Termino do desafio em: 24/08/2020
 * 
 */

const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
      return response.status(400).json({ error: 'Invalid project ID.' });
  }

  return next();
}

app.use('/repositories/:id', validateProjectId);

app.get("/repositories", (request, response) => {
  
  const { title } = request.query;

  const results = title 
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if(title === "" || typeof(title) === typeof(undefined) ||
    url === "" || typeof(url) === typeof(undefined) ||
    techs === "" || typeof(techs) === typeof(undefined)){
    return response.status(400).json({ error: "Parâmetros insuficientes para a criação de um Repository."});
  }

  const repository = { 
    id: uuid(), 
    title: title, 
    url: url, 
    techs: techs, 
    likes: 0 };

    repositories.push(repository);

    return response.json( repository );
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { url, title, techs } = request.body;
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex < 0){
        return response.status(400).json({ error: "Repository not found."});
    };
    
    const repo =  repositories[repositoryIndex];

    const repository = {
      id: id,
      title: title, 
      url: url, 
      techs: techs,
      likes: repo.likes
    };

    repositories[repositoryIndex] = repository;
    
    return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex < 0){
        return response.status(400).json({ error: "Repository not found."});
    };

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex < 0){
        return response.status(400).json({ error: "Repository not found."});
    };

    var repository = repositories[repositoryIndex];

    repository.likes  = repository.likes + 1;

    return response.json( repository );
});

module.exports = app;
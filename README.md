# HringBoard4CLV

HringBoard4CLV is short for "Hring board for Collov test". This builds a "Kanban board" website to manage the hiring process.


## Quickstart

The project can be either started using docker or running natively.

### Docker

To use Docker, make sure the docker is installed before executing the instructions.

```sh
    build.sh
    run.sh
```

### Running Natively 

To run natively, following setups has to be done in advance.

 - Install NodeJS
 - Install and run MongoDB (use the default port number 27017)
 - In app.js, switch the mongoose connection from "mongodb" to "localhost"
 - Run the following instructions

```sh
    npm install
    npm start (or nodemon)
```
 - Open the web browser (chrome) and visit https://localhost:3000/

### Attention
  
To run this program, make sure the ports(3000 and 27107) are available.


## Tech

### Frontend

HTML, Javascript

### Backend

NodeJS, Express, mongoose

### Database

MongoDB

### Deployment

Docker, Github


## Folder structure

Folder "views/" contains the frontend files.

Folder "routes/" contains the backend files.

Folder "models/" contains the mongoDB models.

Folder "public/" contains the static resource.
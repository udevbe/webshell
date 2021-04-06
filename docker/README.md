# About
Run webshell locally using docker

# Preparation
- Make sure you build the webshell site first. There should be a `/build` directory present in the root of the repo.

# Installation
- `docker-compose up`

# Login setup
Webshell uses Keycloak to handle auth. In order to login you need to add a new user.

- Go to `http://localhost:8080` and go to the administration console. You can login with username: `admin` and password: `admin`.
- Add a user. In the left menu, click `Users` and add a new user with a username. Go to the tab `Credentials` and set the user password, make sure to uncheck `Temporary`.

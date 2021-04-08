# About
A simple webshell implementation of the [Greenfield cloud compositor](https://github.com/udevbe/greenfield).

# Install
- `yarn install`

# Build
- Make sure you install first.
- From the root of this repo: `yarn build`

# Start development mode
- Make sure you install first
- From the root of this repo: `yarn start`

# Run the whole thing in docker
- Make sure you completed the build step first.
- In the `docker` directory run `docker-compose up`.

Webshell uses Keycloak to handle auth. In order to login you need to add a new user.

- Go to `http://localhost:8080` and go to the administration console. You can login with username: `admin` and password: `admin`.
- Add a user. In the left menu, click `Users` and add a new user with a username. Go to the tab `Credentials` and set the user password, make sure to uncheck `Temporary`.
- Go to `http://localhost` and login with your new user.


# Configuring available apps:
- Adjust `/public/apps.json` to change the launch id, name & icon location of apps displayed in the webshell.
- Adjust the launch ids you previously changed, so they have a match in `docker/app-endpoint-server/config.json5`.  
- Adjust `/public/apps/<app-id>/icon.svg` to change the icon of apps displayed in the webshell.
- Rebuild.

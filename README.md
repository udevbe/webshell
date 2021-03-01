# Install
`yarn install`

# Build
- Make sure you install first.
- From the root of this repo: `yarn build`

# Start development mode
- Make sure you install first
- From the root of this repo: `yarn start`

# Build docker
- Make sure you build first.
- From the root of this repo: `docker build -f docker/ngix/Dockerfile . -t webshell`

# Run docker
- Make sure you build docker first.
- `docker run -p80:80 webshell`
- Go to `http://localhost`
- Credentials see `docker/ngix` README.md

# Configuring available apps:
- Adjust `/public/apps.json` to change the launch id, name & icon location of apps displayed in the webshell.
- Adjust `/public/apps/<app-id>/icon.svg` to change the icon of apps displayed in the webshell.

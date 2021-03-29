# About
An ngix webserver that serves the webshell site resources.

To change or add credentials [update](https://httpd.apache.org/docs/2.4/programs/htpasswd.html) the `conf/htpasswd` file.

# Usage
- Make sure you build the webshell site first. There should be a `/build` directory present in the root of the repo.
- In the root of the run `docker build -f docker/webshell/Dockerfile . -t webshell`
- Run `docker run -p80:80 webshell`
- Go to `http://localhost`
- Make sure to run the app-endpoint-server or no program will launch.

Login credentials are:
- username: `test`
- password: `test`

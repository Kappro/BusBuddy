# BusBuddy Backend API

_This `README.md` assumes that you have already cloned the repo._

# Table of Contents
- [Setup Instructions](#setup-backend)
- [Pre-configured Users]()

# Setup Backend
- First, ensure you are in backend directory.
```
$ cd /var/www/BusBuddy/app
```
- Create a virtual environment. Replace .venv with your desired name for the virtual environment.
```
$ sudo python3 -m venv .venv
```
- The activation of the virtual environment clashes with the use of 'sudo' when installing packages. Hence, the method is to use the Python file directly in .venv/bin.
```
$ sudo .venv/bin/pip install -r ../requirements
```
- Create a .env file in /app with the stipulated parameters.
```
$ sudo nano .env
DATABASE_USER="<database username>"
DATABASE_PASSWORD="<database password>"
HOST="<database port, default 3306>"
```
- Now, the backend is ready. It can be deployed on http://localhost:8080 using
```
$ sudo .venv/bin/python3 app.py
```

# Pre-configured Users


# API Docs

The full API documentation can be found on http://localhost:8080/apidocs when the server is up and running.
The API documentation is powered by [Flasgger](https://github.com/flasgger/flasgger), a Flask-configured Swagger
documentation Python library. Some screenshots can be observed below as to how the API documentation should look like.

## API Endpoints

The BusBuddy API depl
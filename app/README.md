# BusBuddy Backend API

This backend API is powered by Flask.

# Table of Contents
- [Technical Stuff](#tech-stuff)
  - [Important Constraints](#important-constraints)
  - [Backend Folders](#backend-folder-architecture)
- [Setup Instructions](#setup-instructions)
  - [Deploying as Service](#deploying-as-service)
  - [Pre-configured Users](#pre-configured-users)
- [API Documentation](#api-docs)
- Other README Directories
  - [Main](../README.md)
  - [Frontend](../appfront/README.md)
  - [Automated Deployment System](../ads/README.md)


# Tech Stuff

## Important Constraints
- Database HAS to be setup and running before backend can be deployed. This prevents any backend errors from occurring.
- Backend uses JSON Web Tokens for authentication for all routes starting with `/api`. Do not make direct calls to the API through
  web browser as it will result in `401: Unauthorised Access`. For testing, directly access the deployed Flask server and
  for a full home page with available actions.

## Backend Folder Architecture
All `__init__.py` files are to declare folders as modules.
- `📁 models` - Contains the database models that correctly map database tables to Flask-SQLAlchemy models in Python.
  - `📁 accounts` - Contains the account models.
    - `</> account.py` - Contains the code for the Account model.
  - `📁 entities` - Contains the entities models.
    - `</> bus.py` - Contains the code for the Bus model.
    - `</> load.py` - Contains Enum for Load that is used in `bus.py` and `route.py`.
    - `</> route.py` - Contains the code for the Service and Stop models.
  - `</> deployment.py` - Contains the code for the Deployment model.
  - `</> shared.py` - Contains shared database model from Flask-SQLAlchemy.
  - `</> utils.py` - Contains shared utility functions to prevent circular imports.
- `🚫 .gitignore` - Tells Git to ignore IDE-specific and computer-specific folders.
- `📁 templates` - Contains dev page views for dev testing.
- `</> app.py` - Contains all the backend API functions and the Flask app that can be run.

# Setup Instructions
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
## Deploying as Service
- First, install gunicorn in the virtual environment.
```
$ sudo ../app/.venv/bin/pip install gunicorn
```
- Write a service file and name it `busbuddyapi.service` for the backend API. `busbuddyapi` can be replaced with the name you like, but
  that is what will be referred to for this document.
```
$ sudo nano /etc/systemd/system/busbuddyapi.service
```
- Into the file, insert the following.
```
[Unit]
Description=Gunicorn instance for BusBuddy API.
After=network.target
[Service]
User=VMadmin
Group=www-data
WorkingDirectory=/var/www/BusBuddy/app
ExecStart=/var/www/BusBuddy/app/.venv/bin/gunicorn -b <VM IP address>:8080 app:app
Restart=always
[Install]
WantedBy=multi-user.target
```
- To start the service, run the following:
```
$ sudo systemctl start busbuddyapi
$ sudo systemctl enable busbuddyapi
$ sudo systemctl status busbuddyapi
```
- After the last line, it should show that the service is running. It should be running on local port 8080.

## Pre-configured Users
| Email          | Password | Access  | Name      |
|----------------|----------|---------|-----------|
| test@gmail.com | 12345    | Manager | Test      |
| 1@driver.com   | 111      | Driver  | Driver 1  |
| 2@driver.com   | 222      | Driver  | Driver 2  |
| 3@driver.com   | 333      | Driver  | Driver 3  |
| 4@driver.com   | 444      | Driver  | Driver 4  |
| 5@driver.com   | 555      | Driver  | Driver 5  |
| 6@driver.com   | 666      | Driver  | Driver 6  |
| 7@driver.com   | 777      | Driver  | Driver 7  |
| 8@driver.com   | 888      | Driver  | Driver 8  |
| 9@driver.com   | 999      | Driver  | Driver 9  |
| 10@driver.com  | 101010   | Driver  | Driver 10 |

# API Docs

The full API documentation can be found on http://localhost:8080/apidocs when the server is up and running.
The API documentation is powered by [Flasgger](https://github.com/flasgger/flasgger), a Flask-configured Swagger
documentation Python library. Some screenshots can be observed below as to how the API documentation should look like.
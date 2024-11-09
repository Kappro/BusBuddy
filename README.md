# BusBuddy 🚌

Welcome to BusBuddy! BusBuddy is a bus management system that seeks to be the buddy who assists everyone.
BusBuddy is able to automatically deploy drivers and buses based on bus stop loads, while providing a
dynamic user interface for both the manager and the drivers!

# Table of Contents

- [Demo Video](#demo-video)
- [Technical Stuff](#tech-stuff)
  - [Important Constraints]()
  - [Tech Stack](#tech-stack)
  - [Top Level Folders](#top-level-folder-architecture)
  - [External APIs Employed](#external-apis-used)
- [Setup Instructions](#setup-instructions)
  - [Pre-Requisites](#pre-requisite)
  - [SQL Database](#setup-sql-database)
  - [Backend](#setup-backend)
  - [Frontend](#setup-frontend)
  - [Automated Deployment System](#setup-automated-deployment-system)
  - [Pre-configured Users](#pre-configured-users)
- [Development Process](#development-process)
  - [Contributors](#contributors)
- Other README Directories
  - [Backend](app/README.md)
  - [Frontend](appfront/README.md)

# Demo Video


# Tech Stuff
## Tech Stack
**Frontend**:
- Angular v18
  - TypeScript-based frontend framework.
  - Stylesheets based on SASS.
  - [CoreUI](https://coreui.io/bootstrap/docs/getting-started/introduction/) library for pre-made styles and functionalities.

**Backend**:
- Flask
  - Python-based backend framework.
  - Flask-SQLAlchemy for database configuration.
- MySQL

## Important Constraints
**Backend**:
- Database HAS to be setup and running before backend can be deployed. This prevents any backend errors from occurring.
- Backend uses JSON Web Tokens for authentication for all routes starting with `/api`. Do not make direct calls to the API through
  web browser as it will result in `401: Unauthorised Access`. For testing, directly access the deployed Flask server and
  for a full home page with available actions.

**Frontend**:
- Backend HAS to be running before frontend can be deployed. This ensures there will not be unnecessary failed API requests.

**Automated Deployment System** (ADS):
- Backend HAS to be running before ADS can be deployed. This ensures there will not unnecessary failed API requests.
- To keep ADS running, a browser running the ADS deployed port has to be kept open on the page

## Top-level Folder Architecture
- `📁 ads`
  - Contains just the Automated Deployment System.
- `📁 app`
  - Contains all the backend folders and files. Refer to its [README](app/README.md) for more information on its folder architecture.
- `📁 appfront`
  - Contains all the frontend folders and files. Refer to its [README](appfront/README.md) for more information on its folder architecture.
- `🚫 .gitignore`
  - Tells Git to ignore IDE-specific and computer-specific folders.
- `🛢 busbuddydumpv3.sql`
  - Contains the DDLs and pre-configured figures for the database. Uses MySQLDump to configure.
- `{} package.json`
  - Contains just the Angular-CLI package that can be installed via NPM. Alternatively, ignore this to install Angular-CLI
    globally on your system.
- `☰ requirements`
  - Contains necessary Python libraries to be installed into the virtual environment.

## External APIs Used
- **LTA Datamall Data** (full API documentation can be found [here](https://datamall.lta.gov.sg/content/dam/datamall/datasets/LTA_DataMall_API_User_Guide.pdf).
  - Bus Stop Data
  - Buses Data
- **OpenStreetMap**
  - [Map Tiles](https://www.openstreetmap.org/)

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


# Setup Instructions
## Pre-requisite
These instructions are based on a Ubuntu 22.04 virtual machine (VM). It can be applicable to deployment on
cloud services as well.
- If using a virtual machine, ensure following ports are forwarded:<br>
4200 (backend)<br>
8080 (frontend)
- Reserve 3306 for database too.
- Install python necessities and NPM.<br>
```
sudo apt install python3-pip -y
sudo apt install python3-venv -y
sudo apt install npm -y
```
- If running on Ubuntu 22.04, NodeJS will be too out of date.
   1. Force uninstall NodeJS.<br>
   ```
   $ sudo apt purge nodejs &&\
   $ rm -r /etc/apt/sources.list.d/nodesource.list &&\
   $ rm -r /etc/apt/keyrings/nodesource.gpg
   ```
   2. Remove some broken dependencies.<br>
   ```
   $ sudo dpkg --remove --force-remove-reinstreq libnode-dev
   $ sudo dpkg --remove --force-remove-reinstreq libnode72:amd64
   ```
   3. Tell the system to update to NodeJS 20.
   ```
   $ sudo mkdir -p /etc/apt/keyrings
   $ sudo apt install -y ca-certificates curl gnupg
   $ curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
   $ NODE_MAJOR=20
  $ echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
  ```
  4. Complete the re-installation of NodeJS.
  ```
  $ sudo apt update
  $ sudo apt install nodejs -y
  ```
- Install Angular CLI globally.
```
$ sudo npm install -g @angular/cli
```

Next, you will have to clone this repository onto the virtual machine.
- Can choose your favourite method. I shall explain the use of Github CLI.
- First install the CLI.
```
$ sudo apt install gh
```
- Login to your account. I used an authentication key.
```
$ gh auth login
```
- Clone the repo.
```
$ cd /var/www
$ gh repo clone Kappro/BusBuddy
$ cd BusBuddy
```
- You should have the repo cloned, cd'd within the repo.

## Setup SQL Database
- Use the MySQLDump within BusBuddy repo.
- Install MySQL CLI. Then, create a database 'busbuddy'.
```
$ sudo mysql -u root -p
mysql > CREATE DATABASE busbuddy;
mysql > exit;
```
- Load the MySQLDump into the database.
```
sudo mysql -u root -p busbuddy < /var/www/BusBuddy/busbuddyv2.sql
```
- Check for completion with below. You should see a table being displayed.
```
$ sudo mysql -u root -p
mysql > SELECT * FROM busbuddy.account;
```

## Setup Backend
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

## Setup Frontend
- First, ensure you are in frontend directory.
```
$ cd /var/www/BusBuddy/appfront
```
- Install necessary packages.
```
$ sudo npm install
```
- Now, the frontend is ready. It can be deployed on http://localhost:4200 using
```
$ sudo ng serve -host 0.0.0.0
```

## Setup Automated Deployment System
- First, ensure you are in ADS directory.
```
$ cd /var/www/BusBuddy/ads
```
- Use the virtual environment from section 4 to run the app.
```
$ sudo ../app/.venv/bin/python3 ads.py
```
- Now, it will be deployed on http://localhost:1234.
- A separate local browser is required to be open on the above URL to keep the system up and running.

# Development Process

Using a SCRUM framework, we would sprint for every 2 weeks, leading to constant deployment and testing.
We also employed pair programming, a key feature in extreme programming to ensure accountability. However,
working in a group of 5, we had one pair and one trio instead.

Given the models required of us, we decided
to have the group of 2 to work on the fullstack development, with the group of 3 working on operations and
other necessary documents. In addition, we would have the group of 3 act as "customers" to test the product every meeting. This allows
quick finds on bugs that appear in the developers' codes so they can be worked on for the next meeting.

## Contributors

| Name of Member | Group      | Main Role(s)                    |
|----------------|------------|---------------------------------|
| Glenn Lim      | Developer  | Backend                         |
| Jerrald Siow   | Developer  | Frontend                        |
| Ryan Ching     | Operations | Server Config, Models, Customer |
| Darren Ng      | Operations | Models, Documents, Customer     |
| Isaac Ng       | Operations | Models, Documents, Customer     |
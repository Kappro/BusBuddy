# BusBuddy

## Introduction
Welcome to BusBuddy! BusBuddy is a bus management system that seeks to be the buddy who assists everyone.
BusBuddy is able to automatically deploy drivers and buses based on bus stop loads, while providing a
dynamic user interface for both the manager and the drivers!

## Tech
### Tech Stack

- Angular v18
- Flask
- Flask-SQLAlchemy
- MySQL

## Setting Up Instructions

### 1. Pre-requisites
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
   ```aiignore
   $ sudo dpkg --remove --force-remove-reinstreq libnode-dev
   $ sudo dpkg --remove --force-remove-reinstreq libnode72:amd64
   ```
   3. Tell the system to update to NodeJS 20.
   ```aiignore
   $ sudo mkdir -p /etc/apt/keyrings
   $ sudo apt install -y ca-certificates curl gnupg
   $ curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
   $ NODE_MAJOR=20
  $ echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
  ```
  4. Complete the re-installation of NodeJS.
  ```aiignore
  $ sudo apt update
  $ sudo apt install nodejs -y
  ```
- Install Angular CLI globally.
```aiignore
$ sudo npm install -g @angular/cli
```

### 2. Clone Repo
- Can choose your favourite method. I shall explain the use of Github CLI.
- First install the CLI.
```
$ sudo apt install gh
```
- Login to your account. I used an authentication key.
```aiignore
$ gh auth login
```
- Clone the repo.
```aiignore
$ cd /var/www
$ gh repo clone Kappro/BusBuddy
$ cd BusBuddy
```
- You should have the repo cloned, cd'd within the repo.

### 3. Setup SQL Database
- Use the MySQLDump within BusBuddy repo.
- Install MySQL CLI. Then, create a database 'busbuddy'.
```aiignore
$ sudo mysql -u root -p
mysql > CREATE DATABASE busbuddy;
mysql > exit;
```
- Load the MySQLDump into the database.
```aiignore
sudo mysql -u root -p busbuddy < /var/www/BusBuddy/busbuddyv2.sql
```
- Check for completion with below. You should see a table being displayed.
```aiignore
$ sudo mysql -u root -p
mysql > SELECT * FROM busbuddy.account;
```

### 4. Setup Backend
- First, ensure you are in backend directory.
```aiignore
$ cd /var/www/BusBuddy/app
```
- Create a virtual environment. Replace .venv with your desired name for the virtual environment.
```aiignore
$ sudo python3 -m venv .venv
```
- The activation of the virtual environment clashes with the use of 'sudo' when installing packages. Hence, the method is to use the Python file directly in .venv/bin.
```aiignore
$ sudo .venv/bin/pip install -r ../requirements
```
- Create a .env file in /app with the stipulated parameters.
```aiignore
$ sudo nano .env
DATABASE_USER="<database username>"
DATABASE_PASSWORD="<database password>"
HOST="<database port, default 3306>"
```
- Now, the backend is ready. It can be deployed on http://localhost:8080 using
```aiignore
$ sudo .venv/bin/python3 app.py
```

### 5. Setup Frontend
- First, ensure you are in frontend directory.
```aiignore
$ cd /var/www/BusBuddy/appfront
```
- Install necessary packages.
```aiignore
$ sudo npm install
```
- Now, the frontend is ready. It can be deployed on http://localhost:4200 using
```aiignore
$ sudo ng serve -host 0.0.0.0
```

### 6. Setup Automated Deployment System
- First, ensure you are in ADS directory.
```aiignore
$ cd /var/www/BusBuddy/ads
```
- Use the virtual environment from section 4 to run the app.
```aiignore
$ sudo ../app/.venv/bin/python3 ads.py
```
- Now, it will be deployed on http://localhost:1234.
# BusBuddy Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.6.

# Table of Contents
- [Technical Stuff](#tech-stuff)
  - [Important Constraints](#important-constraints)
  - [Frontend Top-Level Folders](#frontend-top-level-folder-architecture)
    - [Frontend Source Code Folders](#frontend-source-code-folder-architecture)
    - [Frontend Application Folders](#frontend-application-folder-architecture)
    - [Frontend Views Folders](#frontend-views-folder-architecture)
- [Setup Instructions](#setup-instructions)
  - [Deploying as Service](#deploying-as-service)
  - [Pre-configured Users](#pre-configured-users)
- Other README Directories
  - [Main](../README.md)
  - [Frontend](../appfront/README.md)

# Tech Stuff

## Important Constraints
- The backend HAS to be fully deployed and setup on local port 8080. If not, there will be unauthorised errors on requests.

## Frontend Top-Level Folder Architecture
- `📁 src` - Contains the entire frontend source codes.
- `🚫 .gitignore` - Tells Git to ignore IDE-specific and computer-specific folders.
- `🛢 busbuddydumpv3.sql` - Contains the DDLs and pre-configured figures for the database. Uses MySQLDump to configure.
- `{} package.json` - Contains all the necessary frontend packages. To be NPM installed.
- `{} angular.json` - Contains necessary configuration for Angular.
- `{} tsconfig.json` - Contains necessary configuration for TypeScript.

### Frontend Source Code Folder Architecture
Below paths are under `BusBuddy/appfront/src`.
- `📁 app` - Contains all files of the Angular application.
- `📁 assets` - Contains necessary images to be loaded in the website.
- `📁 scss` - Contains app-wide shared style variables and definitions to ensure consistency in styling.
- `<> index.html` - Entry point for the application.
- `💡 main.ts` - Contains logic for entry point of application.

### Frontend Application Folder Architecture
Below paths are under `BusBuddy/appfront/src/app`. For the sake of the number of components, EVERY component
will contain `*.component.ts` (component logic), `*.component.html` (component template) and `*.component.scss` (component styles).
- `📁 _models` - Contains models based on the backend emulated to TypeScript.
  - `account.ts` - Account model based on backend.
- `📁 icons` - Necessary definitions used for CoreUI icons.
  - The files within are used for the above description.
- `📁 layout` - Files required for overlay.
  - `📁 default-layout` - Contains files required for overlay for all pages.
    - `📁 default-footer` - Contains footer of overlay for all pages.
    - `📁 default-header` - Contains header of overlay for all pages.
  - `💡 _nav.ts` - Contains the available navigation routes to the user. Used in sidebar.
  - `💡 index.ts` - Necessary to make these layouts exportable.
- `💡 index.ts` - Necessary to make all above files exportable.
- `📁 services` - Contains services shared among all views.
  - `💡 api.service.ts` - Contains API service that holds URL to query backend from.
  - `💡 auth.guard.service.ts` - Contains injectable guard service to direct the correct access type to its respective view.
  - `💡 auth.interceptor.ts` - Contains injectable HTTP client service to include JSON Web Token as a header for every HTTP request.
  - `💡 auth.service.ts` - Contains authentication service with functions to login, register etc.
  - `💡 logout.component.ts` - Logout component called when logout button is clicked.
- `📁 views` - Contains all the views that the user can see.
- `🧩 app.component.*` - Contains first component that is used to load every subsequent component.
- `🔀 app.routes.ts` - Contains routes to login, manager, or driver pages.

### Frontend Views Folder Architecture
Below paths are under `BusBuddy/appfront/src/app/views`. For the sake fo the number of components, EVERY component
will contain `*.component.ts` (component logic), `*.component.html` (component template) and `*.component.scss` (component styles).
- `📁 driver` - Contains views for drivers.
  - `📁 _modals` - Contains shared pop-up modal components for driver views.
    - `📁 cancelleddeployment` - Contains cancelled deployment notification pop-up.
      - `🧩 cancelleddeployment.component`
    - `📁 newdeployment` - Contains new deployment notification pop-up.
      - `🧩 newdeployment.component`
  - `📁 dashboard` - Contains driver's dashboard view.
    - `🧩 dashboard.component`
  - `📁 drivinghistory` - Contains driver's driving history view.
    - `🧩 drivinghistory.component`
  - `📁 overview` - Contains driver's overview, i.e. driver's current deployment view.
    - `🧩 overview.component`
  - `🔀 routes.ts` - Contains routes available to driver.
- `📁 manager` - Contains views for manager.
  - `📁 _modals` - Contains shared pop-up modal components for manager views.
    - `📁 changedrivermodal` - Contains pop-up for manager to change deployment's driver.
      - `🧩 changedrivermodal.component`
    - `📁 confirmcanceldeployment` - Contains pop-up for manager to confirm cancellation of a deployment.
      - `🧩 confirmcanceldeployment.component`
    - `📁 driverhistorymodal` - Contains pop-up for manager to view selected driver's history.
      - `🧩 driverhistorymodal.component`
    - `📁 routemodals` - Contains modals for bus routes/services.
      - `📁 addroute` - Contains pop-up for manager to add a new route.
        - `🧩 addroute.component`
      - `📁 deleteroute` - Contains pop-up for manager to delete a route.
        - `🧩 deleteroute.component`
      - `📁 editroute` - Contains pop-up for manager to edit an existing route.
        - `🧩 editroute.component`
    - `📁 stopmodals` - Contains modals for bus stops.
      - `📁 addstop` - Contains pop-up for manager to add a new bus stop.
        - `🧩 addstop.component`
      - `📁 deletestop` - Contains pop-up for manager to delete a bus stop.
        - `🧩 deletestop.component`
  - `📁 busdrivers` - Contains manager's bus driver management view.
    - `🧩 dashboard.component`
  - `📁 busroute` - Contains manager's bus routes and bus stops management view.
    - `🧩 busroute.component`
  - `📁 deployment` - Contains manager's deployment management view.
    - `🧩 deployment.component`
  - `📁 register` - Contains manager's bus driver registration view.
    - `🧩 register.component`
  - `📁 request` - Contains manager's new requests management view.
    - `🧩 request.component`
  - `🔀 routes.ts` - Contains routes available to manager.
- `📁 page404` - Contains shared view if 404 error is returned.
    - `🧩 page404.component`
- `📁 page500` - Contains shared view if 500 error is returned.
    - `🧩 page500.component`

# Setup Instructions
These instructions assume that you have cloned the Git repo, and into `/var/www`.
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

## Deploying as Service
- To use `nginx` for deployment, we shall first configure the frontend to query the correct port of backend.
```
$ sudo nano /var/www/BusBuddy/appfront/src/app/services/api.service.ts
```
- You should see an attribute in the `ApiService` class, `HOST`. Replace the `localhost` string to the correct
  IP address of your virtual machine.
- Then, build the frontend. The default output should be `~/BusBuddy/appfront/dist`.
```
$ sudo ng build
```
- Install `nginx` into the virtual machine.
```
$ sudo apt install nginx
```
- In `/etc/nginx/sites-available`, access the default available sites.
```
$ sudo nano /etc/nginx/sites-available/default
```
- Assuming the built output is indeed in `~/BusBuddy/appfront/dist`, change the following.
  - Comment out `listen [::]:80 default_server`. This line might cause issues with deployment.
  - Change the `root` to `/var/www/BusBuddy/appfront/dist/appfront/browser`.
  - You can change the `server_name` to whatever you like.
- Then, run `nginx`.
```
$ sudo systemctl start nginx
$ sudo systemctl enable nginx
$ sudo systemctl status nginx
```
- After the above, the terminal should that the service is running. It should be running on port 80.

![img.png](readmeimages/nginx.png)

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

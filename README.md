# Role Based Access Control (...still in dev mode...)

This is a Role Based Access Control application using Nodejs, Express, Passport Js, etc.
You can use this application as the starting point for whatever project you are going to build which needs authentication and authorization.

The submitted project is a User Management System built with Node.js, Express.js, and MongoDB, showcasing essential CRUD functionalities along with a responsive and user-friendly interface. The application is designed to allow administrators to manage user data effectively, offering features such as adding, editing, deleting, and filtering users.

The application is styled with Bootstrap for modern UI components and responsiveness, ensuring it is accessible on different devices. Password security is implemented using bcrypt, ensuring secure handling of user credentials.

For authentication we have only Email & Password option but other authentication options using OAuth/OAuth2.0 like Google, Facebook, Apple, GitHub, etc, can be easily incorporated.

The application is based on the **MVC pattern** i.e. Model View Controller.

**Mongoose** is used as an ORM for MongoDB for storing Users in Database.

**Passport JS** is used for local(email, password) authentication.

The application is _almost_ **production ready**.

---

## Demo
https://cipherschools-383611.as.r.appspot.com/

## To start setting up the project

Step 1: Clone the repo

```bash
git clone https://github.com/Anabil-Baruah/RBAC
```

Step 2: cd into the cloned repo and run:

```bash
npm install
```

Step 3: Put your credentials in the .env file.

```bash
PORT=3000
MONGODB_URI=YOUR_MONGODB_URI(example: mongodb://localhost:27017)
DB_NAME=YOUR_DB_NAME
ADMIN_EMAIL=ANY_EMAIL(example: admin@gmail.com)
```

Step 4: Install MongoDB (Linux Ubuntu)

See <https://docs.mongodb.com/manual/installation/> for more infos

Step 5: Run Mongo daemon

```bash
sudo service mongod start
```

Step 6: Start the app by

```bash
npm start
```
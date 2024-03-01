# Notes from YT Video: "CRUD API Tutorial - Node, Express, MongoDB" by freeCodeCamp.org

Parker Dunn
February 15, 2024

## Objective

I want to better understand the overall backend development process with regard to (1) storing and interacting with data via a database, (2) routing information between frontend and backend, and (3) deploying a fullstack service.

## Summary

*To be completed at the end*

## Outline

* Create a `package.json` file (a.k.a. install node packages)
* Expresss framework
* 


## Notes

* What is the "MERN" stack?
  * M = MongoDB
  * E = Express(.js)
  * R = React
  * N = Node.js

### Create package.json

* Video walks through the meaning of the contents in package.json
  * e.g., You can describe your app
  * e.g., you can specify what the "main" script is (for `npm start` I presume)
  * e.g., you can specify testing scripts
    * You can define any name (not just test) then use `npm run *name*` to have npm run the command automatically
    * For testing, it would look like `npm run test` and would run whatever command was defined by `"test": ...` in `package.json`

### Express framework

* Shows how to look up npm packages at [npmjs.com](www.npmjs.com)
* In `express` routes, there is always (1) a route - e.g., "/auth" and (2) a callback function
  * I understand the route, but this tutorial gives some additional information about the callback function, which is what should be done when routed to this "page"
  * The boilerplate code for this callback function is...

```{javascript}
    (req, res) => {
        // what should be done
    }
```

* (continued)
  * `req`
    * req => "request"
    * "Whatever the client sends to the server"
  * `res` 
    * res => "response"
    * "Whatever the server returns to the client"

### API Testing Tools

* Shows a software for testing an API that we are developing: [**insomnia.rest**](www.insomnia.rest)
  * My passphrase: **tQfSrSo$J7N3**
  * Shows how to set up GET requests to test an API

>[!WARNING]
> You cannot lose this passphrase under any circumstance. It will render all data related to insomnia.rest unaccessible and will be lost forever.

* Shows another software for testing APIs: [**postman**](www.postman.com)
  * *No content about this shown initially*

### Git Bash

* Installs git for windows
* Creates a `.gitignore`

### Nodemon package

* Installs a package that automatically refreshes a backend server when updates are made to the scripts that control the server
  * `npm i nodemon -D`
* NPM Page for [nodemon](https://www.npmjs.com/package/nodemon)
* **I also learned what a dev dependency is**
  * You can install npm packages in a way that they are only listed as packages needed during development
  * they are not dependencies of the application
* Added to `package.json` a `dev` command
  * `"dev": "nodemon index.js"`

### Connect to a MongoDB database

* I signed up for MongoDB Atlas
  * Used my Google account
  * Project 0 (Started for me via quickstart)
    * Username: pdunn91
    * Password: Ew9iMohiHLzRKYYB
* MongoDB started to create a project automatically (Project 0)
* I created another project to follow along the tutorial
  * "volo-playlists-dev"
  * Security Quickstart Information for this project
    * Authentication -> Username and password
      * pdunn91
      * kb2uu9z0hBluJvhf
    * Connect from?
      * Added my current IP for my laptop at home: 73.123.85.172/32

> [!NOTE]
> I set up this first project as if I am going to have a different MongoDB project for each stage of the development lifecycle: development, staging, and production.
> 
> Since naming is not exceptionally important to functionality, I figured I'd add "dev" to the name of this project and leave room for adding functionality, though I might not need other projects.

> [!IMPORTANT] ALLOWING CONNECTION FROM ANY DEVICE TO MongoDB DATABASE
> You can allow access to any IP address for this project by entering `0.0.0.0` to the IP Access List!

* Showed how to actually set up the connection to MongoDB
  * Click on "Database" under the left menu, then select "Connect"
    * You can also select connect from the "Overview" page
  * To connect to a JS/Node backend, you use "Drivers"
  * A step-by-step guide is shown for how to connect to the database
* Set up `mongoose` package
  * `npm i mongoose`
  * "Mongoose is a MongDB object modeling tool designed to work in an asynchonous environment"
  * I did not copy the code for now, but the tutorial shows how to ....
    * Configure the database connection with mongoose

> [!NOTE] "Connection name"
> When he was setting up connection to MongoDB with `mongoose`, the author mentioned a **"collection name"**
>
> The collection name comes after the forward slash ("mongodb.net/") and before the query parameters in the connection string.
>
> I have marked where the collection name goes in the string below:  
> `mongodb+srv://pdunn91:<password>@volo-play-dev.hsbm6cs.mongodb.net/<** collection name **>?retryWrites=true&w=majority`
>
> The author does not explain what this is yet.

* AUTHOR SUGGESTION: You should make the connection to the database, then start the server!
  * I believe the idea is ... the server should not be operational if it cannot connect to the database since it won't be able to perform it's operations without the database.
  * I added this to my code in `server.js`

## Data Models (backend/models/)

* model => "something that we could use to store data into our database"
  * e.g., in the tutorial, he uses products
* Sounds like it should be recognizable by node.js and the database!
* NAMING CONVENTION: `<what it is>.model.js`
  * e.g., `product.model.js`
* Used `mongoose` to create the data model
  * Defined a schema by creating fields
  * Showed how to have "created at" and "updated at" fields automatically
    * `timestamps: true`
  * Made the schema available to MongoDB by creating a model
  * *don't forget to export the new model!*

> [!IMPORTANT]
> Model/schema names should be singluar names because MongoDB automatically makes them plural.
>
> For example, we create a schema called `productSchema`. When we create the model, the code shold be `const Product = mongoose.model("Product", productSchema);`, which MongoDB will call "Products".

* Time to use the new data model

## Create API

* Author creates a "post" route for the new data model!
  * Location: `/api/products`

> [!NOTE] REMINDER
> POST requests are probably going to be necessary endpoints, but you cannot visit these pages.
>
> Inherently, navigating to a page like `localhost:8888/api/products` performs a GET request to this address, which does not work if there is only a POST request setup at this address.

* (FOLLOW UP TO REMINDER ABOVE) THIS IS WHERE *INSOMNIA* COMES INTO PLAY!!
  * Author showed how to create a POST request that tests the node/express POST endpoint of the API
  * What does insomnia offer?
    * You can add parameters to the request
    * Create a body to the request that would be something like a JSON object
    * Preview of the webpage - e.g., author used `res.send(req.body)` to have the API show the request body, which showed up in Insomnia

>[!WARNING] Express.js Default - No JSON Objects
> Situation  
> The tutorial author was trying to test a POST endpoint and attempted to send request with a body containing a JSON object. The JSON object was not being received at the POST endpoint.
>
> Explanation  
> `express.js` does not allow JSON objects as a body of a POST request by default
>
> Solution  
> We have to add a middleware that allows JSON to be sent to out API. After the creation of the application (`const app = express();`), you have to add `app.use(express.json());`.

* How to use the POST endpoint to send and store data in MongoDB (40 min in)
  * Creates a `try-catch` block with error handling
  * Imported the product model made earlier
  * Used data model to `create()` a new DB record
    * This method will return the newly created object
    * It is in fact created :)
  * 


LEFT OFF @ 45 min - https://youtu.be/_7UQPve99r4?si=9oXAVRNxlK8xhuT-&t=2720

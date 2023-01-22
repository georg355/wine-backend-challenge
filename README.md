# wine-backend-challenge

## setup instructions
- install mongoDB and mongosh
- create a storage location for the db using mongod.exe --dbpath="c:\wine-storage"
- open connection using mongosh shell with the destination: mongodb://localhost:27017/wine-storages
- navigate in another command line into the myexpress folder and run node server using: npm main.js (make sure to have required packages installed before)

## documentation
- challenges: 
  - tried using the fetch and ajax syntax to test if my API endpoints are working and both got me a buffer time out error of the connection 
  --> came over several possible fixes and implemented them (like increasing the buffer time, specifying the ip of localhost, bindIp option set to 0.0.0.0 to make it accessible from everywhere be aware its critical in terms of security) but didnt get a good solution for that problem and due to deadlines from university i am not able to continue researching to solve this problem 
  - get familiar how node.js is working and understand the api structure in detail
  - due to my currently most often used programming language python i needed to remind myself to use the semicolons ;)
- optimizations: 
  - error handling more detailed 
  - design gui endpoints in the browser (e.g. a form to insert data that can be used to add a new wine to stock instead of using calling methods)
- design decisions: 
  - created main.js instead of integrating the code to the given app.js from the express.js framework cause i wanted you to have all my own written code           seperated in a file
  - used async/await syntax to make the code more readable


# Descrition of the application.
- project has both prod and dev configurations to remove the unnecessary docker file commands from the prod configuration.
  
## qa-api
- Folder database contains databasequeries.js for the database functions and database.js for creating the connection with the database.
- Folder functionality contains endpoint.js containining all the functions handling the websocket requests and contains imports of the database query functions from the databasequery.js file for functioning with the database. Helper.js contains error handling of the funcitons and also creating response for the client from the server.
- Folder websocket contains websocket.js where the websocket connection is created and the websocketfunctions.js contains the mappings of the different type calls coming from the client and then triggers the right functions from the endpoints.js file and returns their result to the client.
- app.js is where the server is setup
- deps.js is where the depencies are exported

## qa-ui
- Folder api contains apicalls.js that handles the different apicalls made from the client to the server and websocket.js setups the websocket connection and then sends the messages from apicalls.js file and returns messages form the server.
- Folder src/components/shared contains ui components that can be used across the application
- Folder src/components contains the ui main pages Home,Courses,Course,QuestionAnswers where the helper components are used to build the sites.
- Folder Layout contains Footer and Header and Layout where trough the slot in the layout file all the different pages are rendered
- Folder pages has all the different site addresses handled with in the folder structure inside the astro files the svelte files are imported for rendering trough the layoutfile. The contact, terms,privacy astro has the content with in there self no separate files needed they are demo files just for simple text output
  - Stores folder has the file stores.js for handling of the localstorage and sessionstorage variables of the app



## Possible improvements
- overall the there could be made the data getting from the server more simpler and not always fetch all of the arrays of that specific course could use the data that is already the data that the client side has and just check if there is updates on the server and then send those files that client dont have.






























# TESTS

## Playwright
- Tests for WebSocket connection and check all the courses exist
- Adding question to a course
- Checking that the question page opens
- Checking the upvoting of the questions
- Checking the upvoting of the answers
- Checking if the llmanswers list has content
- Checking if the answer inputted goes to the answer list
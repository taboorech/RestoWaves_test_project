Uses of technology:
Express.js: Used to create the backend of the application. Its routing allows you to process requests to different URL paths that are associated with different routers 
(productsRouter, sheetsRouter).

Google Sheets API: Used to communicate with Google Sheets. It allows you to retrieve data from Google Sheets using the googleapis package.

PostgreSQL (PG): The PostgreSQL database is used to store product size data. Using the pg module, we interact with the database, executing requests to update sizes.

setInterval: A JavaScript function that executes code after a specified time interval. In this case, it is used to periodically check for updates in Google Sheets.

Potential problems:
The code has some potential issues, such as error handling in the function that checks product sizes and interacts with the database.
It is also important to note that periodic functions can affect server performance, depending on the amount of data.

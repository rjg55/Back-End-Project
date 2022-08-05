# FOR FUTURE DEVELOPERS

Please follow these steps in order to setup this repo

# HEROKU

[Here](https://wtan.herokuapp.com/) is a link for the hosted version of this API.

# SUMMARY

This aim of this project was to build a back-end of a news website (i.e. Reddit) which will be able to provide information to a front end architecture. It was designed to mimic a real-world API and be able to access application data programmatically. The database is PSQL and node-postgres is used to interact with it.

The principles of MVC (Model-View-Controller) have been applied. Express JS is used to build the server. RESTful endpoints are used to enable clear and logical access to desired endpoints. Error handling is also used via middleware functions to ensure a client-side errors are displayed appropriately. Testing (via JEST) of all endpoints/error handling is also included to ensure all code is robust.

# INSTRUCTIONS TO INSTALL THIS API

## 1. CLONE THIS REPO

1. Go to the github page for this repository - found [here](https://github.com/rjg55/Back-End-Project)
2. Fork it to your own github account
3. Click the green code icon and copy the https web URL
4. In your terminal of choice, navigate to where you would like to store your copy of the repository
5. Input command: **git clone INSERT-COPIED-REPO-URL**
6. Open the repo in your IDE of choice (If using VSCode - Input command: **code .**)

## 2. INSTALL DEPENDENCIES

To run this API, you will need to install the required dependencies (such as express JS and jest)

1. In your terminal in the IDE of choice - run: **npm install**

## 3. SET UP LOCAL .ENV FILES

Please create two files in the main directory:

- .env.test
- .env.development

Within these files add PGDATABASE=**<your_test_database_name_here>** (.env.test) and PGDATABASE=**<your_database_name_here>** (.env.development)

Once finished, add these files to the .gitignore file

## 4. SEED LOCAL DATABASE

You now need to setup your database and populate it with data (seeding)

1. In the terminal:
   - **npm run setup-dbs**
   - **npm run seed**

## 5. TESTING

This repo comes with some tests already written for existing endpoints and utility functions. They are contained within the folder **tests**.

Run the test suite: **npm test**

## 6. MINIMUM SOFTWARE VERSION REQUIREMENTS

1. Node.JS version **8.11.0 or above**
2. Postgres-SQL version **8.7.3 or above**

#

## All done - you're ready to run locally!

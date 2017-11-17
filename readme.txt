Everything I typed in the command line to make this work.

CMD: md todo-api
CMD: cd todo-api
VSCODE: F1 - bash in workspace
BASH: git init
BASH: NPM init (enter to all and YES)
VSCODE: create .gitignore
VSCODE: node_modules/
BASH: npm install express@4.13.3 --save
VSCODE: +server.js
VSCODE TERMINAL: node server.js to test to see if code is good.
VSC TERM: heroku login
VSC TERM: heroku create
VSC TERM: heroku rename itrmc-todo-api
VSC TERM: git push heroku master
Chrome: https://itrmc-todo-api.herokuapp.com
OR VSC TERM: heroku open
    git status
    git diff
    git commit
    git push heroku
Chrome
    github.com
    new repository
        todo-api
        udemy node course rest api in express
        copy code from browser to push existing library
        paste into console
VSC TERM
    git remote add origin https://github.com/itrmc/todo-api.git
    git push -u origin master
Postman
    added environments
    added key apiUrl
VSC TERM
    npm install body-parser@1.13.3 --save //this is for parsing body elements in post operations
PACKAGE.JSON
    "underscore": "^1.8.3" added to dependencies
VSC TERM
    NPM INSTALL

//Now, we add database operations
npm install sequelize --save
npm install sqlite3 --save

create data folder
create new file ".keep" in the data folder. this helps with git and some OSes

create new file in root of project "db.js"

create new models folder

now, we're about to make heroku ready for the database stuff

heroku addons:create heroku-postgresql:hobby-dev
npm install pg@4.4.1 --save
npm install pg-hstore@2.3.2 --save


# Northcoders News API

*Live Hosted Version*
- You will find a link to the hosted version here: https://nc-news-xq0k.onrender.com/

*Summary*
- A simple web service API, constructed using PSQL and Node-Postgres.
- The application data used consists of various articles, users, comments, and users.
- The data can be queried for in the live-version with endpoints such as:
    - /api/users
    - /api/articles
    - /api/articles/:article_id/comments
    - Please see __'endpoints.json'__ for more examples and further details

*General Setting Up*
- You can __clone__ this repo using the command 'git clone https://github.com/Pirkhs/nc-news.git' in your terminal
- *Installing Dependencies*
    - When installing dependencies please run the command 'npm install'
    - __MUST HAVE__ dependencies: 'dotenv', 'express', 'pg, 'husky'
    - __OPTIONAL__ dependecies for tests in app.test.js: 'jest', 'jest-extended', 'jest-sorted', 'pg-format', 'supertest'
- Before sending any requests, ensure the database is seeded locally via the command 'npm run seed'

*Creating .env Files*
- Add .env files '.env.test' and '.env.development' with their appropriate PGATABASE names either nc_news_test or nc_news respectively, as shown in the setup.sql file

*PSQL and Node-Postgres Version*
- It is recommended to be in PSQL version 15.5 and Node version 21.2.0 (or above)

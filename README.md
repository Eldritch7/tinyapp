# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (using bit.ly). Users can register/login and enter urls with a generated short URL which will only be visible to that user. They can also delete and edit these entries, and use the short url to link to the original url's site. This app uses cookies and hashed passwords.

Be aware however, because the database is stored on the server, all entered data will be lost on server restart.

## Final Product
!["Register New User"](https://github.com/Eldritch7/tinyapp/blob/main/Images/register.png)

!["Store a url with a new short URL"](https://github.com/Eldritch7/tinyapp/blob/main/Images/create.png)

!["Url Index: shown with cookies"](https://github.com/Eldritch7/tinyapp/blob/main/Images/indexURLS.png)

!["A Page to Edit existing URLS"](https://github.com/Eldritch7/tinyapp/blob/main/Images/editPage.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
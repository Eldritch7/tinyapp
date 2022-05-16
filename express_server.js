//SERVER SETUP
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

//Imported Function: When given an email and user database, returns the user id of the email if it's registered
const emailIdlookup = require("./helpers");


app.use(cookieSession({
  name: 'session',
  keys: ["SecretCode"],

  
}));


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//FUNCTIONS

//Generate Random 6 Character String Function

const generateRandomString = function() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let length = characters.length;
  
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += characters.charAt(Math.floor(Math.random() *
    length));
  }
  

  return random;

};

//Lookup with Email Function: Takes in an email and user database, that emails password if registered

const emailLookup = function(email, userVar) {
  for (let user in userVar) {
   
    if (userVar[user].email === email) {
      return userVar[user].password;
    }
  } return false;
};



//SERVER DATABASE - will use an actual database eventually

//Stored URL Data
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

//Dummy User Database for Structure Reference (the examples no longer work functionally as they are not hashed)

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

//GET REQUESTS - RENDERED PAGES

//Get Root Page and Redirect

app.get("/", (req, res) => {
  res.redirect("/urls");
});

//Get Index Page

app.get("/urls", (req, res) => {
  const user  = req.session.user;
  
  if (!user) {
    res.send(`<html><body><h1>Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b></body></html>\n`);
  } else if (user) {
   

    const userId = user["id"];
    const email = user["email"];
    const filteredUrls = {};
    const keys = Object.keys(urlDatabase);

    keys.forEach((key) => {

      let innerKeys = urlDatabase[key];
      
      if (userId === innerKeys["userID"]) {
        
        filteredUrls[key] = innerKeys;
      }

    
     

     
    

    });
    const templateVars = {
      urls: filteredUrls,
      user: user
    };
    res.render("urls_index", templateVars);
  }
});

//Get Create New URL Page

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: req.session.user
  };
  res.render("urls_new", templateVars);
});

//Get Specific Short URL Page

app.get("/urls/:shortURL", (req, res) => {
  const user = req.session.user;
  const shortURL = req.params.shortURL;
  
  if (!user) {
    res.status(400).send(`<html><body><h1>1Please <a href="/login">Login </a> or <a href="/register">Register</a>.</h1></b></body></html>\n`);

    
  } else if (!urlDatabase[shortURL]) {
    res.status(400).send(`<html><body><h1>Does not Exist.</a></h1></b>\n<a href = '/urls'>Index<a></body></html>\n`);
   

  } else if (user["id"] !== urlDatabase[shortURL]["userID"]) {
    res.status(400).send(`<html><body><h1>2Please <a href="/login">Login </a> or <a href="/register">Register</a>.</h1></b>\nOtherwise this may not be your link.</body></html>\n`);
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params['shortURL']]["longURL"],
      user: req.session.user
    };
    
    res.render("urls_show", templateVars);

  }
   
  
  
});

//Redirect to Stored Webpage

app.get("/u/:shortURL", (req, res) => {
  
  const shortURL = req.params.shortURL;
  const shortUrlCheck = function() {
    for (let url in urlDatabase) {
      
      if (url === shortURL) {
        return true;
  
      }
      
    
    }
    return false;

  };
  if (shortUrlCheck()) {
    const longURL = urlDatabase[req.params.shortURL]["longURL"];
    res.redirect(`${longURL}`);

  } else {
    res.status(400).send("shortURL not found in Database.");
  }
  
  
  
  
});

//Get .json

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Get Register Page

app.get("/register", (req, res) => {
  const templateVars = {
    user: req.session.user
  };
  res.render("register", templateVars);
});

//Get Login Page

app.get("/login", (req, res) => {
  const templateVars = {
    user: req.session.user
  };
  res.render("login", templateVars);
});


//POST REQUESTS

//Post New URL

app.post("/urls/new", (req, res) => {
  const user = req.session.user;
  
  if (!user) {
    res.redirect("/login");
  } else if (user) {
    const userId = user["id"];
    const email = user["email"];
    
    if (emailIdlookup(email, users) === userId) {
      
      let shortURL = generateRandomString();
      let long = req.body.longURL;
      
      
      urlDatabase[shortURL] = {
        "longURL": long,
        "userID": userId
      };
     
    
      
    
      res.redirect(`/urls/${shortURL}`);
  
    }

  
    
  }
});

//Post Delete

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = req.session.user;
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.status(400).send(`<html><body><h1>Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b>\nDoes Not Exist.</body></html>\n`);
  
  
  
  }  else if (!user) {
    res.status(403).send(`<html><body><h1>Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b>\nYou do not have permission to delete this.</body></html>\n`);
   
  } else if (user["id"] !== urlDatabase[shortURL]["userID"]) {
    res.status(403).send(`<html><body><h1>Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b>\nYou do not have permission to delete this.</body></html>\n`);
  
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');

  }
  
  

});

//Post Edit

app.post("/urls/:shortURL", (req, res) => {
  
  const user = req.session.user;
  const shortURL = req.params.shortURL;
  
  if (!urlDatabase[shortURL]) {
    
    res.status(400).send(`<html><body><h1>Does not Exist.</h1></b>\n<a href = '/urls'>Index<a></body></html>\n`);
  
  
  
  }  else if (!user) {
    res.status(403).send(`<html><body><h1>Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b>\nYou do not have permission to delete this.</body></html>\n`);
   
  } else if (user["id"] !== urlDatabase[shortURL]["userID"]) {
    res.status(403).send(`<html><body><h1>Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b>\nYou do not have permission to delete this.</body></html>\n`);
  
  } else {
  //Edit the Url
    urlDatabase[req.params.shortURL] = {
      longURL: req.body.longURL,
      userID: user["id"]
    };

    
   
    res.redirect(`/urls/${req.params.shortURL}`);
  }
});

//Post Login

app.post("/login", (req, res) => {
  const {email, password} = req.body;
  
  if (!(emailLookup(email, users))) {
    res.status(403).send("User Not Found.");
    
  }  else if (!bcrypt.compareSync(password, (emailLookup(email, users)))) {
    res.status(403).send("Incorrect Password");

  } else if (bcrypt.compareSync(password, (emailLookup(email, users)))) {
    const userId = emailIdlookup(email, users);
    req.session.user = users[userId];
    
    res.redirect(`/urls`);

  }

});

//Post Logout

app.post("/logout", (req, res) => {
  
  req.session = null;
  res.redirect(`/login`);
});


//Post Register

app.post("/register", (req, res) => {
  const {email, password} = req.body;
 
  if (emailLookup(email, users)) {
    res.status(400).send("E-mail already registered");
    
   
  } else if (email === "" || password === "") {
    res.status(400).send("E-mail or Password Empty");
    
  } else {
    const userId = generateRandomString();
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[userId] = {
      id : userId,
      email,
      password : hashedPassword
    };
   
    req.session.user = users[userId];
    
    res.redirect("/urls");

  }
 
  

  
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



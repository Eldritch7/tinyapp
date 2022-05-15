//Server Setup
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//Functions

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

const emailLookup = function(email, userVar) {
  for (let user in userVar) {
   
    if (userVar[user].email === email) {
      return userVar[user].password;
    }
  } return false;
};

const emailIdlookup = function(email, userVar) {
  for (let user in userVar) {
    
    if (userVar[user].email === email) {
      return user;
    }
  } return false;
};

//Server Database
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
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };
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

//Rendered Pages

app.get("/", (req, res) => {
  res.redirect("/urls");
});
app.get("/urls", (req, res) => {

  const cookie = req.cookies["user"];
  if (!cookie) {
    res.send(`<html><body><h1>Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b></body></html>\n`);
  } else if (cookie) {
   
    const userId = req.cookies["user"]["id"];
    const email = req.cookies["user"]["email"];
    const filteredUrls = {};
    const keys = Object.keys(urlDatabase);

    keys.forEach((key) => {
      console.log("length", keys.length);

      
      console.log("key", key);
      let innerKeys = urlDatabase[key];
      
      if (userId === innerKeys["userID"]) {
        
        filteredUrls[key] = innerKeys;
      }

    
     

     
    

    });
    const templateVars = {
      urls: filteredUrls,
      user: req.cookies["user"]
    };
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: req.cookies["user"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const cookie = req.cookies["user"];
  const shortURL = req.params.shortURL;
  console.log(shortURL);
  if (!cookie) {
    res.status(400).send(`<html><body><h1>Please <a href="/login">Login </a> or <a href="/register">Register</a>.</h1></b></body></html>\n`);

    
  } else if (!urlDatabase[shortURL]) {
    res.status(400).send(`<html><body><h1>Does not Exist.</a></h1></b>\n<a href = '/urls'>Index<a></body></html>\n`);
   

  } else if (cookie["id"] !== urlDatabase[shortURL]["userID"]) {
    res.status(400).send(`<html><body><h1>Please <a href="/login">Login </a> or <a href="/register">Register</a>.</h1></b>\nOtherwise this may not be your link.</body></html>\n`);
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params['shortURL']]["longURL"],
      user: req.cookies["user"]
    };
    
    res.render("urls_show", templateVars);

  }
   
  
  
});

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

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/register", (req, res) => {
  const templateVars = {
    user: req.cookies["user"]
  };
  res.render("register", templateVars);
});
app.get("/login", (req, res) => {
  const templateVars = {
    user: req.cookies["user"]
  };
  res.render("login", templateVars);
});


//Post Requests

app.post("/urls/new", (req, res) => {
  const cookie = req.cookies["user"];
  console.log(cookie);
  if (!cookie) {
    res.redirect("/login");
  } else if (cookie) {
    const userId = req.cookies["user"]["id"];
    const email = req.cookies["user"]["email"];
    
    if (emailIdlookup(email, users) === userId) {
      console.log("Hello from in the loop!", "userID", userId);
      let shortURL = generateRandomString();
      let long = req.body.longURL;
      
      
      urlDatabase[shortURL] = {
        "longURL": long,
        "userID": userId,
      };
      // console.log(urlDatabase);
     
    
      
    
      res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
  
    }

  
    
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const cookie = req.cookies["user"];
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.status(400).send(`<html><body><h1>2Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b>\nDoes Not Exist.</body></html>\n`);
  
  
  
  }  else if (!cookie) {
    res.status(403).send(`<html><body><h1>Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b>\nYou do not have permission to delete this.</body></html>\n`);
   
  } else if (cookie["id"] !== urlDatabase[shortURL]["userID"]) {
    res.status(403).send(`<html><body><h1>2Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b>\nYou do not have permission to delete this.</body></html>\n`);
  
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');

  }
  
  

});

app.post("/urls/:shortURL", (req, res) => {
  const cookie = req.cookies["user"];
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    
    res.status(400).send(`<html><body><h1>Does not Exist.</h1></b>\n<a href = '/urls'>Index<a></body></html>\n`);
  
  
  
  }  else if (!cookie) {
    res.status(403).send(`<html><body><h1>Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b>\nYou do not have permission to delete this.</body></html>\n`);
   
  } else if (cookie["id"] !== urlDatabase[shortURL]["userID"]) {
    res.status(403).send(`<html><body><h1>2Please <a href="/login">Login </a> or <a href="/register">Register</a></h1></b>\nYou do not have permission to delete this.</body></html>\n`);
  
  } else {
  //edit
  urlDatabase[req.params.shortURL] = {longURL: req.body.longURL};
  console.log(urlDatabase);
  
 
  res.redirect(`/urls/${req.params.shortURL}`);
  }
});

app.post("/login", (req, res) => {
  const {email, password} = req.body;
  if (emailLookup(email, users) === password) {
    const userId = emailIdlookup(email, users);
    console.log(userId);
    res.cookie("user", users[userId]);
    res.redirect(`/urls`);
  } else if (!(emailLookup(email, users))) {
    res.status(403).send("User Not Found.");
    //res.redirect(403, "/register");
  } else if (emailLookup(email, users) !== password) {
    res.status(403).send("Incorrect Password");

  

  }

});

app.post("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect(`/login`);
});



app.post("/register", (req, res) => {
  const {email, password} = req.body;
 
  if (emailLookup(email, users)) {
    res.status(400).send("E-mail already registered");
    
   
  } else if (email === "" || password === "") {
    res.status(400).send("E-mail or Password Empty");
    
  } else {
    const userId = generateRandomString();
    users[userId] = {
      id : userId,
      email,
      password
    };
    console.log(users[userId]);
   
   
    res.cookie("user", users[userId]);
    res.redirect("/urls");

  }
 
  

  
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
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
  const templateVars = {
    urls: urlDatabase,
    user: req.cookies["user"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: req.cookies["user"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    user: req.cookies["user"]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(`${longURL}`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  const templateVars = {greeting: 'Hello World!'};
  res.render("hello_world", templateVars);
  
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
  
  let shortURL = generateRandomString();
  let long = req.body.longURL;
  
  urlDatabase[shortURL] = long;
  

  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  
  
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.post("/login", (req, res) => {
  const {email, password} = req.body;
  if (emailLookup(email, users) === password) {
    const userId = emailIdlookup(email, users);
    console.log(userId);
    res.cookie("user", users[userId]);
    res.redirect(`/urls`);
  } else if (!(emailLookup(email, users))) {
    res.redirect(403, "/register");
  } else if ((email, users) !== password) {
    res.redirect(403, "/login");
  }

});

app.post("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect(`/urls`);
});



app.post("/register", (req, res) => {
  const {email, password} = req.body;
  console.log(emailLookup(email, users));
  if (emailLookup(email, users)) {
    res.redirect(400, "/register");
   
  } else if (email === "" || password === "") {
    res.send(400, "E-mail or password empty");
  } else {
    const userId = generateRandomString();
    users[userId] = {
      userId,
      email,
      password
    };
   
   
    res.cookie("user", users[userId]);
    res.redirect("/urls");

  }
 
  

  
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



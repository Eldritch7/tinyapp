//Function returns a user ID when given an email, if that email is registered
const emailIdlookup = function(email, userVar) {
  for (let user in userVar) {
    
    if (userVar[user].email === email) {
      return user;
    }
  } return false;
};



module.exports = emailIdlookup;
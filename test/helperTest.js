const { assert } = require('chai');

const emailIdlookup  = require('../helpers.js');

const testUsers = {
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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = emailIdlookup("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert(user === expectedUserID);
    
    // Write your assert statement here
  });
  it('should return undefined with an unregistered e-mail', function() {
    const user = emailIdlookup("user@example2.com", testUsers);
    const expectedUserID = false;
    assert(user === expectedUserID);
  });
});
const sql = require("./db.js");
var path = require('path');
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config.js");
// constructor
const User = function User(user) {
  this.Username = user.Username;
  this.Password = user.Password;
};

User.create = (newUser, result) => {
  //Check if user exists already
      console.log("userregister: "+newUser.Username);
      sql.query("INSERT INTO LoginInfo SET ?", newUser, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("created customer: ", { id: res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
      });

};

User.login = (user, result) => {
  console.log("UseR:" + user.Username)
  sql.query("SELECT * FROM LoginInfo WHERE Username = ?",user.Username, (err, results) =>{
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    else {
      console.log("AAAAAAA"+results[0].Password+"   "+user.Password);
      console.log("BBBBb"+(bcrypt.compare(user.Password, results[0].Password)));
      if(results.length<1)
      {
        console.log("it ran through here");
        result(null, 'failed');
        return;
      }
      else {
        bcrypt.compare(user.Password, results[0].Password,(error,dataa)=>{
          console.log("ASDASD"+dataa)
          if(dataa)
          {
            console.log("it ran through here too");
            const userToken= jwt.sign({Username: user.Username},jwtConfig.JWTPASSWORD,{expiresIn:"1h"});
            console.log("tokenaazzz "+userToken);
            result(null, { token: userToken});
          }
          else {
            console.log("it ran through 123123asdasdfsagds");
            result(null, 'failed');
            return;
          }
        })
      }
    }
  })

}

module.exports = User;

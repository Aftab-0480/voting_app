const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// POST route to add a User
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; // Assuming the request body contains the User data due to bodyParser

    // Check if admin already exists or not
    if(data.role === 'admin'){
      const existingAdmin = await User.findOne({role: 'admin'})

      if(existingAdmin){
        return res.status(403).json({message: 'Admin already exist, Only one admin is allowed'});
      }
    }

    // Create a new User document using the mongoose model
    const newUser = new User(data);

    // Save the newUser in database
    const response = await newUser.save();
    console.log('data saved');

    const payload = {
      id: response.id
    }

    const token = generateToken(payload);
    console.log('Token is:', token);
    res.status(200).json({response: response, token: token});
  } catch (err) {
    console.log(err);
    res.status(500).json({error: 'Internal server error'});
  }
});

// Login route
router.post('/login', async (req, res) => {
  try{
    // Extract username and password from request body
    const {aadharCardNumber, password} = req.body;

    // Find the user by aadhaar Number
    const user = await User.findOne({aadharCardNumber: aadharCardNumber});

    // If user does not exist or password does not match, return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid username or password'});
    }

    // generate token 
    const payload = {
      id: user.id
    }

    const token = generateToken(payload);

    // return token as response
    res.status(200).json({token: token});
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try{
    const userData = req.user; // here using jwtAuthMiddleware so it will give the payload as userData

    const userId = userData.id;
    const user = await User.findById(userId);

    res.status(200).json(user);
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

// Router to update user password
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
  try{
    const userId = req.user; // Extract the id from the token
    const {currentPassword, newPassword} = req.body; // Extract current and new passwords from request body

    // Find the user by userid
    const user = await User.findById(userId);

    // if password does not match return error
    if(!(await user.comparePassword(currentPassword))){
        return res.status(401).json({error: 'Invalid password'})
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    console.log('password updated');
    res.status(200).json({message: "Password Updated"});
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});


module.exports = router;
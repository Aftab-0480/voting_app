const express = require('express');
const router = express.Router();
const Candidate = require('./../models/candidate');
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

const checkAdminRole = async function(userID){
    try{
        const user = await User.findById(userID);
        return user.role === 'admin'
    }catch(err){
        return false;
    }   
}

router.post('/', jwtAuthMiddleware, async (req, res) => {
    try{
        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'User does not have admin role'});
        }
        const data = req.body; // Assuming the request body contains the candidate data

        // Create a new Candidate document using the Mongoose model
        const newCandidate = new Candidate(data);

        // Save the new Candidate to the database
        const response = await newCandidate.save();
        console.log('data saved');

        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try{
        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'User does not have admin role'});
        }
        const candidateId = req.params.candidateID; // Extract the candidate id from the URL parameter
        const updatedCandidateData = req.body; // Updated data for the candidate

        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
            new: true, // Return the updated data
            runValidators: true, // Run Mongoose Validation
        })

        if(!response){
            return res.status(404).json({error: 'Candidate not found'});
        }

        console.log('data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try{
        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'User does not have admin role'});
        }
        const candidateID = req.params.candidateID;
        const response = await Candidate.findByIdAndDelete(candidateID);
        if(!response){
            return res.status(404).json({error: 'Candidate not found'});
        }

        console.log('candidate data deleted');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// let's start voting
router.post('/vote/:cadidateID', jwtAuthMiddleware, async (req, res) => {
    // no admin can vote
    // user can only vote once
    candidateID = req.params.cadidateID;
    userId = req.user.id;
    try{
        
        // Find the Candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({message: 'Candidate not found'});
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        if(user.isVoted){
            return res.status(400).json({message: 'You have already voted'});
        }
        if(user.role === 'admin'){
            return res.status(403).json({message: 'admin is not allowed'});
        }

        // update the candidate document to record the vote
        candidate.votes.push({user: userId});
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true;
        await user.save();

        res.status(200).json({message: 'Vote record successfully'});


    }catch(err){    
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// vote count 
router.get('/vote/count', async (req, res) => {
    try{
        // Find all candidates and sort them by voteCount
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);

    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal Server Error'});
    }
})

module.exports = router;
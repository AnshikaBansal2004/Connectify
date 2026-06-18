import express from 'express';
import signup from '../Controllers/authController.js';

const router = express.Router(); //express makes routing in web much easier

//sign up (creating the user); http method - post
router.post('/signup',signup); //when routed to /signup, run the signup logic 

export default router;  
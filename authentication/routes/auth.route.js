import express from 'express';
import signup, { login } from '../Controllers/authController.js';

const router = express.Router(); //express makes routing in web much easier

//sign up (creating the user); http method - post
router.post('/signup',signup); //when routed to /signup, run the signup logic 

//login route
router.post('/login',login);

export default router;  

//index.js -> /auth
// /signup
// /login 
// API used - post 
import express from 'express';
import verifyToken from "../middleware/verifyToken.js";
import getUsers from '../Controllers/user.controller.js';

const router = express.Router(); 

router.get('/',verifyToken,getUsers);

export default router;  


//index.js -> /users
// /(username)
//API used -> GET 
import express from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req,res,next)=>{
      // token from cookie
      const token = req.cookies.jwt;

      if(!token){
            return res.status(401).json({message : "not authorized to access the user list; token does not exist"});
      }

      try{
            const decoded = jwt.verify(token,process.env.JWTTokenSecret);
            next(); //runs the getuser()
      }
      catch(error){
            return res.status(401).json({message : "not authorized to access the user list; invalid token"});  
      }
}

export default verifyToken
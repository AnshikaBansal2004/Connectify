import jwt from "jsonwebtoken";

//adds the jwt in cookie for this response
const generateJWTtokenandsetCookie = (userID,res)=>{
      const token = jwt.sign({userID},process.env.JWTTokenSecret,{expiresIn: "25d"});
      res.cookie("jwt",token,{
            maxAge : 15*24*60*60*1000,
            httpOnly : true,
            sameSite : 'lax',
            secure : false
      })
}

export default generateJWTtokenandsetCookie     
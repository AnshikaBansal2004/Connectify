import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";

//creating a user
const signup = async(req,res) => {
      try{
            //user created a username and pwd, we hashed the pwd:
            const{username,password} = req.body;
            const hashedPassword = await bcrypt.hash(password,10);

            //sending this new record to the DB:
            const foundUser = await User.findOne({username}); //checks if user exists in the database
            if(foundUser){
                  res.status(201).json({message: 'Username already exists. Please select a unique username'});
            }
            else{
                 const user = new User({username : username,password:hashedPassword});    
                 console.log(user);
                 await user.save();

                 res.status(201).json({message: 'Username created!'});
            }
      }
      catch(error){
            console.log("error during signup:" + error);
            res.status(500).json({message: 'Username creation failed!'});
      }
}

export default signup;
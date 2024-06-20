//create userAPP
const exp=require('express')
const userAPP=exp.Router()
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const expressasynchandler=require('express-async-handler')
const verifyToken=require('../middlewares/verifyToken')

require('dotenv').config()
let userscollection
let articlescollection
//get user collection object
userAPP.use((req,res,next)=>{
    userscollection=req.app.get('userscollection')
    articlescollection=req.app.get('articlescollection')
    next()
})

//user registeration
userAPP.post('/user',expressasynchandler(async(req,res,)=>{
    //get user resource from client
    const newUser=req.body
    //check for dupicate user based on username 
    const dbuser=await userscollection.findOne({username:newUser.username})
    const checkmail=await userscollection.findOne({email:newUser.email})
    
    // if userfound 

    if(checkmail!=null){
      
      res.send({message:"mail existing please login to continue"})
    }
    else if(dbuser!=null)
      res.send({message:"username taken"})
    else
      {
        //hash the password
        const hashpassword=await bcryptjs.hash(newUser.password,6)
        //replace the plassword with the hashed password
        newUser.password=hashpassword
        //create the user
        await userscollection.insertOne(newUser)

        res.send({message:"user created"})

      }

}))

//user login
userAPP.post('/login',expressasynchandler(async(req,res)=>{
    //get cred obj from client
    const userCred=req.body;
    //check for username
    const dbuser=await userscollection.findOne({email:userCred.email})
    if(dbuser===null)
      res.send({message:"user not found"})
    else{
        //check password
        const status=bcryptjs.compare(userCred.password,dbuser.password)

        if(status===false)
          res.send({message:"invalid password"})
        else{
            //create jwt token and encode it
              const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'})
            //res send
              res.send({message:"login success",token:signedToken,user:dbuser})
        }
    }
}))

//get articles of all users
 userAPP.get('/article',expressasynchandler(async(req,res)=>{
  //get all articles
  let articlesList = await articlescollection.find({ status: true }).toArray();
  //send res
  res.send({ message: "articles", payload: articlesList });

}))

//post comments
userAPP.post('/comment/:articleId',verifyToken,expressasynchandler(async(req,res)=>{
  const userComment = req.body;
  const articleIdu=Number(req.params.articleId);
  //insert userComment object to comments array of article by id
  await articlescollection.updateOne({ articleId: articleIdu},{ $addToSet: { comments: userComment } }
  );
  let article=await articlescollection.findOne({articleId:articleIdu})
  res.send({ message: "Comment posted" ,payload:article.comments});
  
  }
))

  

//export useAPP
module.exports=userAPP

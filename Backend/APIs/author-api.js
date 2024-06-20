//create authorAPP
const exp=require('express')
const authorAPP=exp.Router()
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const expressasynchandler=require('express-async-handler')
const verifyToken=require('../middlewares/verifyToken')
require('dotenv').config()

let authorscollection
let articlescollection


//get user collection object
authorAPP.use((req,res,next)=>{
    authorscollection=req.app.get('authorscollection')
    articlescollection=req.app.get('articlescollection')
    next()
})

//user registeration
authorAPP.post('/author',expressasynchandler(async(req,res,)=>{
    //get user resource from client
    const newUser=req.body
    //check for dupicate user based on username 
    const dbuser=await authorscollection.findOne({username:newUser.username})
    const checkmail=await authorscollection.findOne({email:newUser.email})
    //if userfound 
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
        await authorscollection.insertOne(newUser)

        res.send({message:"author created"})

      }

}))

//user login
authorAPP.post('/login',expressasynchandler(async(req,res)=>{
    //get cred obj from client
    const userCred=req.body;
    //check for username
    const dbuser=await authorscollection.findOne({email:userCred.email})
    if(dbuser===null)
      res.send({message:"author not found"})
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

//add new article by author
authorAPP.post('/article',verifyToken,expressasynchandler(async(req,res)=>{
   //get new article by client
   const newArticle=req.body;
   //post to articles collection
    await articlescollection.insertOne(newArticle)
    res.send({message:"new article created"})

}))

//modify article by author
authorAPP.put('/article',verifyToken,expressasynchandler(async(req,res)=>{
    //get modified article by client
    const modArticle=req.body;
    //update by article id
    let articlescollection=req.app.get('articlescollection')
    let result=await articlescollection.updateOne({articleId:modArticle.articleId},{$set:modArticle})
    let article=await articlescollection.findOne({articleId:modArticle.articleId})
    res.send({message:"Article modified",payload:article})
    
 
 }))

//soft delete article by articleid
authorAPP.put('/article/:articleId',verifyToken,expressasynchandler(async(req,res)=>{
  const artileIdu=Number(req.params.articleId);
  if(req.body.status==true){
      //update status of article to false
      let result=await articlescollection.findOneAndUpdate({articleId:artileIdu},{$set:{status:false}},{returnDocument:"after"})
      res.send({message:"Article deleted",payload:result})
  }else{
      //update status of article to false
      let result=await articlescollection.findOneAndUpdate({articleId:artileIdu},{$set:{status:true}},{returnDocument:"after"})
      res.send({message:"Article restored",payload:result})
  }
 
 }))

 //read articles by articleid
authorAPP.get('/article/:authorname',verifyToken,expressasynchandler(async(req,res)=>{
    //get authors name from url
    let authorname=req.params.authorname
    //get articles whose status is true
    let articlelist=await articlescollection.find({status:true,username:authorname}).toArray()
    
    res.send({message:"atricles",payload:articlelist})
 
 }))


//export useAPP
module.exports=authorAPP


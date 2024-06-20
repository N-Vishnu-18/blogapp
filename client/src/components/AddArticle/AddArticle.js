import React from 'react'
import './AddArticle.css'
import { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { createAxiosWithToken } from '../../axiosWithToken'
import { useNavigate } from "react-router-dom";
function AddArticle() {
  let {register,handleSubmit,formState:{errors}}=useForm()
  let [err, setErr] = useState("");
  let navigate = useNavigate();
  let {currentUser,islogedin}=useSelector(state=>state.userAuthorLoginReducer)

  async function postNewArticle(article) {
    article.dateOfCreation = new Date();
    article.dateOfModification = new Date();
    article.articleId = Date.now();
    article.username = currentUser.username;
    article.comments = [];
    article.status = true;
    const axiosWithToken=createAxiosWithToken()
   //make HTTP post req

   let res=await axiosWithToken.post(`http://localhost:4000/author-api/article`,article)
   console.log(res.data)
   if(res.data.message==='new article created'){
    navigate('/author-profile/articles')
   }else{
    setErr(res.data.message)
    alert("please login to post article");
    localStorage.removeItem('token');
    navigate('/signin');
   }
  };

  useEffect(()=>{
    console.log(islogedin)
    if(islogedin===true){
      
    }else{
      alert("plz login to post article");
      localStorage.removeItem('token');
      navigate('/signin');
    }
  },[islogedin])
  return (
    <div className='addarticle'>
      <form onSubmit={handleSubmit(postNewArticle)} >
      <div className="">
        <label htmlFor="title" className="">Title:</label>
        <input type="text" className="title" id="title" {...register("title",{required:true,maxLength:18,minLength:4})}
        />
        {
          errors.title?.type==='required' && <p style={{color:'red'}}>Title Required</p>
        }
        {
          errors.title?.type==='maxLength' && <p style={{color:'red'}}>Title should contain maximum of 18 characters</p>
        }
        {
          errors.title?.type==='minLength' && <p style={{color:'red'}}>Title should contain atleast of 4 characters</p>
        }
      </div>
      <div className="">
        <label htmlFor="category" className="">category:</label>
        <select {...register("category")} id="category" className="cat" >
          <option value="programming">Programming</option>
          <option value="AI&ML">AI&ML</option>
          <option value="database">Database</option>
        </select>
      </div>
      <div className="">
      <label htmlFor="content" >Content:</label>
      </div>
      <div className="textarea">
        <textarea {...register("content")} className="text" id="content" rows="10"
        ></textarea>
      </div>
      <button type="submit">Post</button>
      </form>
    </div>
  )
}

export default AddArticle
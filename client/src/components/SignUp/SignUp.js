import React, { useState } from 'react';
import './SignUp.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';

function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmitForm(userObj) {
    setIsPending(true);

    try {
      let res;
      if (userObj.userType === 'user') {
        // Make HTTP POST request for user
        res = await axios.post(`http://localhost:4000/user-api/user`, userObj);
        

      } else {
        // Make HTTP POST request for author
        res = await axios.post(`http://localhost:4000/author-api/author`, userObj);
      }

      setIsPending(false);

      if (res.data.message === "User created" || res.data.message === "Author created") {
        navigate('/signin');
      } else {
        console.log(res.data.message);
        setErr(res.data.message || 'Error occurred during registration');
      }
    } catch (error) {
      setIsPending(false);
      console.log(error);
      setErr(error.message || 'Error occurred during registration');
    }
  }

  return (
    <div className='signup'>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <h1 className='signuptitle'>Signup</h1>
        {err && err.length > 0 && <p style={{ color: 'red' }}>{err}</p>}
        
        <div className='usertype'>
          <div className='user'>
            <input type="radio" name="usertype" id="author" value="author" {...register('userType', { required: true })} />
            <label className='userlabel' htmlFor="author">Author</label>
          </div>
          <div className='user'>
            <input type="radio" name="usertype" id="user" value="user" {...register('userType', { required: true })} />
            <label className='userlabel' htmlFor="user">User</label>
          </div>
        </div>
        {errors.userType && <p style={{ color: 'red' }}>Please select User Type</p>}

        <div className='inputs'>
          <input type="text" name="username" id="username" placeholder='Enter username' {...register('username', { required: true })} />
          {errors.username && <p style={{ color: 'red' }}>Username Required</p>}
        </div>
        
        <div className='inputs'>
          <input type="password" name="password" id="password" placeholder='Enter password' {...register('password', { required: true })} />
          {errors.password && <p style={{ color: 'red' }}>Password Required</p>}
        </div>
        
        <div className='inputs'>
          <input type="text" name="email" id="email" placeholder='Enter email' {...register('email', { required: true })} />
          {errors.email && <p style={{ color: 'red' }}>Email Required</p>}
        </div>
        
        <button type="submit">
          {isPending ? <Loading /> : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default SignUp;

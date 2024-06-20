import React from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetState } from '../../redux/slices/userAuthorSlice';
import image from '../Assets/logo192.png';

function Navbar() {
  const { islogedin, currentUser } = useSelector(state => state.userAuthorLoginReducer);
  const dispatch = useDispatch();

  const signout = () => {
    // Removing token from the local storage
    localStorage.removeItem('token');
    dispatch(resetState());
  };

  return (
    <div className='navbar'>
      <div className="icon">
        {/* Correct usage of the img tag */}
        <img src={image} alt="Logo" />
      </div>
      <div>
        <ul>
          {islogedin === false ? (
            <>
              <li><NavLink className='nav-item' to='' onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</NavLink></li>
              <li><NavLink className='nav-item' to='signup' onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}>SignUp</NavLink></li>
              <li><NavLink className='nav-item' to='signin' onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}>SignIn</NavLink></li>
            </>
          ) : (
            <>
              <div className='welcome'>Welcome <span className='username'>{currentUser.username}</span></div>
              <li><NavLink className='nav-item' to='signin' onClick={signout}>SignOut</NavLink></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;

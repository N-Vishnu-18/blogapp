import React, { useEffect } from 'react';
import './Home.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoMdLock } from 'react-icons/io';
import { useSelector } from 'react-redux';

function Home() {
  const { islogedin, currentUser } = useSelector((state) => state.userAuthorLoginReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if (islogedin) {
      if (currentUser.userType === 'author') {
        navigate('author-profile/articles');
      } else if (currentUser.userType === 'user') {
        navigate('user-profile');
      }
    }
  }, []);

  return (
    <div className="home">
      <div class="homewelcome">
        <h1>Welcome to My Blog</h1>
        <p>Discover interesting articles on various topics.</p>
        <p className="homepage">
        <IoMdLock /> Please <NavLink to="signin">Login</NavLink> to Continue
        </p>
      </div>
      
    </div>
  );
}

export default Home;

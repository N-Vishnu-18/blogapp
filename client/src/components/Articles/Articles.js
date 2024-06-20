import React, { useEffect, useState } from 'react';
import './Articles.css';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetState } from '../../redux/slices/userAuthorSlice';

function Articles() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [articlesList, setArticles] = useState([]);
  const { islogedin, currentUser } = useSelector(state => state.userAuthorLoginReducer);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem('token');
        if (!token) {
          handleLogout();
          return;
        }

        const axiosWithToken = axios.create({
          headers: { Authorization: `Bearer ${token}` }
        });

        let res;
        if (currentUser.userType === 'author') {
          res = await axiosWithToken.get(`http://localhost:4000/author-api/article/${currentUser.username}`);
        } else {
          res = await axiosWithToken.get(`http://localhost:4000/user-api/article`);
          if (res.data.payload === 'jwt expired') {
            handleLogout();
            return;
          }
        }

        setArticles(res.data.payload);
        console.log(res.data.payload);
      } catch (error) {
        console.error('Error fetching articles:', error);
        // Handle specific errors or logics here
        // Example: Redirect to error page or display a message
      }
    };

    if (islogedin === true) {
      fetchData();
    } else {
      alert('Please login to view articles');
      handleLogout();
    }
  }, [islogedin, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(resetState());
    navigate('/signin');
  };

  const displaySingleArticle = (article) => {
    const pathPrefix = currentUser.userType === 'user' ? './article' : '../article';
    navigate(`${pathPrefix}/${article.articleId}`, { state: article });
  };

  const ISOtoUTC = (iso) => {
    const date = new Date(iso);
    return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
  };

  return (
    <div className="articlescontainer">
      {articlesList.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        articlesList.map((value, index) => (
          <div className='article' key={index}>
            <h2 className='article-title'>{value.title}</h2>
            <h3>Category &lt;{value.category}&gt;</h3>
            <button onClick={() => displaySingleArticle(value)} className='read-article'>Read Article</button>
            <p>Created On: {ISOtoUTC(value.dateOfCreation)}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Articles;

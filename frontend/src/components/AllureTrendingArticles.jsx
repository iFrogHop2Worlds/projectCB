/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-key */
/* eslint-disable spaced-comment */
/* eslint-disable no-trailing-spaces */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import React, { useState } from "react";

  //testing- simply calls our api and displays  all the trending articles we got from Allure.
const AllureTrendingArticles =()=> {
    const [allureTrending, setAllureTrending] = useState([]);
    const url = 'http://localhost:5000/api/v1/getAllAllureArticles';
    let articles = [];
    const get = async urls => {
      // request to our api
      await axios.get(urls).then(e => {
        // creating an array of elements with our data
        articles = e.data.map((el) => 
          <><p>{el.title}</p><p>{el.content}</p><img src={el.images[el.images.length - 1]} /></>  
     );
        // setting state
        setAllureTrending(articles)

      });
    };
    // quick and dirty gaurd. If we have not fetched anything then fetch.
    if(allureTrending.length < 1){
      get(url);
    }
    
   
    return (
      <div>
        <>
          {allureTrending}
        </>
        
      </div>
    )
}
export default AllureTrendingArticles


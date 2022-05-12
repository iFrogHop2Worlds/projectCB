/* eslint-disable spaced-comment */
/* eslint-disable no-trailing-spaces */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import React, { useState } from "react";
  //test
const AllureTrendingArticles =()=> {
    const [allureTrending, setAllureTrending] = useState([]);
    const url = 'http://localhost:5000/api/v1/getAllAllureArticles';
    const articles = [];
    const get = async urls => {
      // eslint-disable-next-line no-return-await
      await axios.get(urls).then(e => {
        e.data.map(el => {
          articles.push([
            el.title, 
            el.content 
          ]);
        });
        setAllureTrending(articles)
        // console.log(e.data);
      });
    };
    if(allureTrending.length < 2){
      get(url);
    }
    
    console.log(allureTrending);

    return (
      <div>
        {allureTrending}
      </div>
    )
}
export default AllureTrendingArticles


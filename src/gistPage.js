// import React from 'react'

import axios from "axios";
import React, { useEffect, useState } from "react";
import { octokit } from "./components/App";



export default function GistPage({ id, setexpand }) {
    const [data, setdata] = useState([])

  useEffect(() => {
    octokit
      .request("GET /gists/{gist_id}", {
        gist_id: id,
      })
      .then((res) => {
           for (const key in res.data.files) {
               console.log(res.data.files)
               setdata((pre)=> [...pre, {fname : key , content : res.data.files}])
          }
      });
  }, []);

  return (
    <div className="code">
      <h1> Gists </h1>
   {
      data && data.map((val, index)=>{
            console.log(val.key)
            return (
                <div>
                    
                <div> {val.fname} </div>
                
                <div> {val.content[val.fname].content} </div>
              
                <div>{val.content[val.fname].filename } </div>
                
                <div>{val.content[val.fname].language} </div>
               <div>{val.content[val.fname].raw_url } </div>
               </div>
      )} 
      )}
    <button onClick={() => setexpand((pre) => !pre)}> Close </button>
    </div>
  );
}

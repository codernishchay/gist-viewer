import React from "react";
import { Octokit } from "octokit";
import "../styles/App.css";
import { useEffect } from "react";
import { useState } from "react";
import GistPage from "../gistPage";
export const GITHUB_TOKEN = "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";

export const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});
const App = () => {
  const [addmore, setaddmore] = useState(false);
  const [data, setdata] = useState([]);
  const [saved, setsaved] = useState([]);
  const [topic, settopic] = useState("");
  const [forms, setforms] = useState([]);
  const [content, setcontent] = useState("");
  const [description, setdescription] = useState("");
  const [mygist, setmygist] = useState([]);
  const [isPublic, setisPublic] = useState(true);
  useEffect(() => {
    octokit.request("GET /gists/public", {}).then((res) => {
      res.data.forEach((element) => {
        setdata((pre) => [...pre, element]);
      });
    });
  }, []);

  useEffect(() => {
    octokit.request("GET /gists", {}).then((res) => {
      res.data.forEach((element) => {
        setmygist((pre) => [...pre, element]);
      });
    });
  }, []);

  const onSave = () => {
    setsaved((pre) => [...pre, { topic: topic, content: content }]);
    setaddmore(true);
  };
  const gistform = (
    <div className="form">
      <input placeholder="heading" onChange={(e) => settopic(e.target.value)} />
      <textarea
        placeholder="content"
        onChange={(e) => setcontent(e.target.value)}
      />

      <button onClick={onSave}> Save Gist </button>
    </div>
  );

  const addform = () => {
    setforms((pre) => [...pre, gistform]);
  };

  const submit = async () => {
    console.log(saved)
    const data = {};
    saved.forEach((element) => {
      data[topic] = {
        content: element.content,
        language: "Javascript",
        filename: element.topic,
        description: element.description,
      };
    });
    await octokit
      .request("POST /gists", {
        files: data,
        description: description,
      })
      .then((res) => {
        console.log(res);
      });
    setforms([]);
  };

  return (
    <div className="App">
      <div className="header">
        <div> Gist Viewer </div>
      </div>
      <h2>Gist creator</h2>
      <button className="gist-type" onClick={() => setisPublic((pre) => !pre)}>
        {!isPublic ? "Public gists" : "My gists"}{" "}
      </button>
      <>
        {forms.map((form) => {
          return form;
        })}
        <input
          placeholder="description"
          onChange={(e) => setdescription(e.target.value)}
        />
        <button onClick={addform}>{addmore ? "Add More" : "Add Gist"}</button>
      </>
      <button onClick={submit}> Submit </button>
      <div className="cards">
        { !isPublic
          ? data.map((gist, index) => {
              return <GistCard gist={gist} key={index}></GistCard>;
            })
          : mygist.map((gist, index) => {
              return <GistCard gist={gist} key={index}></GistCard>;
            })}
      </div>
    </div>
  );
};

export default App;



























function GistCard({ gist }) {
  const [expand, setexpand] = useState(false);

  const showgist = () => {
    setexpand(true);
  };

  return (
    <div className="gistCard">
      {expand && (
        <div className="gistpage">
          <GistPage setexpand={setexpand} id={gist.id}></GistPage>{" "}
        </div>
      )}
      <div onClick={showgist} className="gist-card">
        <p>{gist.description}</p>
        {gist && <p>{gist.id} </p>}
      </div>
    </div>
  );
}

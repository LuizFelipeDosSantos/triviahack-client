import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";

export function Signup() {
  const navigate = useNavigate();
  const [previewSource, setPreviewSource] = useState();

  /* error also as state variable?*/

  /* state variable form input */
  const [formState, setFormState] = useState({
    avatar: "",
    username: "",
    email: "",
    password: "",
  });

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  /* need that functin? or part of new user? */
  /* const uploadImage = (base64EncodedImage) => {
    console.log(base64EncodedImage);
  }; */

  function handleInput(event) {
    let file = '';
    if (event.target.name === 'avatar') {
      file = event.target.files[0];
      previewFile(file);
    }

    console.log(file, typeof file);
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    //if(!selectedFile) return; //if no file was uploaded, but it is not mandatory...if no selected file use default avatar
    //uploadImage(previewSource);
    //const reader = new FileReader();
    //reader.readAsDataURL(previewSource);
    //reader.onloadend = () => {
      setFormState({
        ...formState,
        avatar: previewSource,
      });
    //};
    addNewUser(formState);
  };

  async function addNewUser() {
    try {
      const response = await axios.post(API_BASE_URL + "/signup", formState);
      console.log(response.data);
      /* navigate back to login page */
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>TRIVIAHACK</h1>
      <h2>Sign up </h2>
      <form onSubmit={handleSubmit}>
        {/* or : action method enctype? instead consts sets method and body & headers... */}

        {/*  error message */}
        {/* where is upload specified to certain parameters: file size  */}
        <input
          type="file"
          name="avatar"
          value={formState.avatar}
          onChange={handleInput}
        />
        <input
          required
          type="text"
          name="username"
          value={formState.username}
          onChange={handleInput}
          placeholder="Enter a username"
        />
        <input
          required
          type="email"
          name="email"
          value={formState.email}
          onChange={handleInput}
          placeholder="Enter an email"
        />
        {/* how to check password pattern: twice onChange? */}
        <input
          required
          type="password"
          name="password"
          value={formState.password}
          title="Password must contain at least 6 characters, including at least one uppercase, one lowercase and one number."
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
          // onchange="this.setCustomValidity(this.validity.patternMismatch ? this.title : '')"
          onChange={handleInput}
          autoComplete={"new-password"}
          placeholder="Enter a password"
        />
        <button type="submit"> Sign up </button>
      </form>

      {previewSource && (
        <img
          src={previewSource}
          alt="chosen avatar"
          style={{ height: "15vh" }}
        />
      )}
      
    </div>
  );
}

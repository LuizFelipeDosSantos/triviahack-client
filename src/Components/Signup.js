import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";
import logo from '../Logo/logo.png'

export function Signup() {
  const navigate = useNavigate();
  const [previewSource, setPreviewSource] = useState();
  const [errorState, setErrorState] = useState();
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

  function handleInput(event) {
    if (event.target.name === 'avatar') {
      const file = event.target.files[0];
      previewFile(file);
    }

    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    });  
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    addNewUser(formState);
  };

  async function addNewUser() {
    try {
        /* axios.post takes two arguments: url and data we pass along */
      const response = await axios.post(API_BASE_URL + "/signup", {user: formState, avatar: previewSource});
      console.log(response.data);
      /* navigate back to login page */
      navigate("/");
    } catch (err) {
      console.log(err.response.data);
      setErrorState({ message: err.response.data.errorMessage });
    }
  }

  return (
    <div className="login">
      <div className="login-box">
        <a href="/"><img className="logo" src={logo} alt="triviahack logo"/></a>
        <h2>Sign up </h2>

        {previewSource && (
          <div className="avatarDiv">
            <img
              className="avatar"
              src={previewSource}
              alt="chosen avatar"
              style={{ height: "20vh" }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* alternatively : action method enctype? instead consts sets method and body & headers... */}

         

          {/* where is upload specified to certain parameters: file size  */}
          <div className="inputfields">

            <label for="avatar">Avatar:</label>
            <input
              type="file"
              name="avatar"
              value={formState.avatar}
              onChange={handleInput}
            />

            <br/>

            <label for="username">Username:</label>
            <input
              required
              type="text"
              name="username"
              value={formState.username}
              onChange={handleInput}
              placeholder="Enter a username"
            />

            <br/>
            <label for="email">Email:</label>
            <input
              required
              type="email"
              name="email"
              value={formState.email}
              onChange={handleInput}
              placeholder="Enter an email"
            />

            <br/>
            <label for="password">Password:</label>
            <input
              required
              type="password"
              name="password"
              value={formState.password}
              title="Password must contain at least 6 characters, including at least one uppercase, one lowercase and one number."
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
              onChange={handleInput}
              autoComplete={"new-password"}
              placeholder="Enter a password"
            />
          </div>
          <br/>

          <button className="btn" type="submit"> Sign up </button>
        </form>
        {errorState && <h2>{errorState.message}</h2>}
      </div>
    </div>
  );
}

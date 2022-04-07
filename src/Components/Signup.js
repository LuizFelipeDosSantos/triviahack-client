import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";

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
        setErrorState(err.errorMessage);
    }
  }

  return (
    <div>
      <h1><a href="/">TRIVIAHACK</a></h1>
      <h2>Sign up </h2>

      {previewSource && (
        <img
          src={previewSource}
          alt="chosen avatar"
          style={{ height: "20vh" }}
        />
      )}

      <form onSubmit={handleSubmit}>

        {/* alternatively : action method enctype? instead consts sets method and body & headers... */}

        {errorState && <h2 style={{ color: "red" }}>{errorState}</h2>}

        {/* where is upload specified to certain parameters: file size  */}

        <input
          type="file"
          name="avatar"
          value={formState.avatar}
          onChange={handleInput}
        />

        <br/>

        <input
          required
          type="text"
          name="username"
          value={formState.username}
          onChange={handleInput}
          placeholder="Enter a username"
        />

        <br/>

        <input
          required
          type="email"
          name="email"
          value={formState.email}
          onChange={handleInput}
          placeholder="Enter an email"
        />

        <br/>

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

        <br/>

        <button type="submit"> Sign up </button>
      </form>
      
    </div>
  );
}

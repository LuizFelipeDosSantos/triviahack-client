import axios from "axios";
import { useState, useContext } from "react";
import { API_BASE_URL, getCsrfToken } from "../consts";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProviderWrapper";

export function Login() {
  const navigate = useNavigate();
  const { addUserToContext } = useContext(AuthContext);
  const [errorState, setErrorState] = useState();
  const [formState, setFormState] = useState({ email: "", password: "" });

  function handleInput(event) {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(formState);
  };

  async function loginUser() {
    try {
      /* send data to server on router.post("/login"....) - & receive error message or session*/
      const response = await axios.post(API_BASE_URL + "/login", formState);
      console.log(response.data);
      addUserToContext(response.data.user);
      getCsrfToken();
      /* can expire after some time - we should log user out if expired or prolong the cookie age */
      /* navigate back to home page after successful login*/
      navigate("/home");
    } catch (err) {
      console.log(err.response.data);
      setErrorState({ message: err.response.data.errorMessage });
    }
  }

  return (
    <div>
      <img></img>
      <h1>TRIVIAHACK</h1>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>

      {errorState && <h2 style={{ color: "red" }}>{errorState.message}</h2>}
        
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={formState.email}
          onChange={handleInput}
          placeholder="Enter your Email"
        />

        <br/>

        <input
          type="password"
          name="password"
          autoComplete={"current-password"}
          value={formState.password}
          onChange={handleInput}
          placeholder="Enter your Password"
        />

        <button type="submit"> Log in </button>
      </form>

      <p>
        Not registered yet? <a href="/signup">Join TRIVIHACK</a>
      </p>
    </div>
  );
}

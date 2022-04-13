import axios from "axios";
import { useState, useContext } from "react";
import { API_BASE_URL, getCsrfToken } from "../consts";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProviderWrapper";
import logo from '../Logo/logo.png'

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
    <div className="login">
      <div className="login-box">
        <img className="logo" src={logo} alt="triviahack logo"/>
        <h2>Log in</h2>
        <form onSubmit={handleSubmit}>

          <div className="inputfields">
            <label for="email">Email:</label>
            <br/>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formState.email}
              onChange={handleInput}
              placeholder="Enter your Email"
            />
            <br/>
            <label for="password">Password:</label>
            <br/>
            <input
              type="password"
              name="password"
              autoComplete={"current-password"}
              value={formState.password}
              onChange={handleInput}
              placeholder="Enter your Password"
            />
            </div>
          <p>
            Not registered yet? <a href="/signup">Join TRIVIHACK</a>
          </p>
          <button className="btn" type="submit"> Log in </button>
        </form>
        {errorState && <h2>{errorState.message}</h2>}
      </div>
    </div>
  );
}

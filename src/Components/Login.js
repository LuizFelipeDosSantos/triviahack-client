import axios from "axios";
import { useState, useContext } from "react";
import { API_BASE_URL, getCsrfToken } from "../consts";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProviderWrapper";

export function Login() {
  const navigate = useNavigate();
  const { addUserToContext } = useContext(AuthContext);

  /* error also as state variable?*/

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
      const response = await axios.post(API_BASE_URL + "/signup", formState);
      console.log(response.data);
      addUserToContext(response.data.user);
      getCsrfToken();
      /* navigate back to home page after successful login*/
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1>TRIVIAHACK</h1>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>

        {/*  error message ?????*/}
        
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={formState.email}
          onChange={handleInput}
          placeholder="Enter your Email"
        />
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

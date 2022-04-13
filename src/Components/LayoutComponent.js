
import axios from "axios";
import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProviderWrapper";
import { API_BASE_URL } from "../consts";
import logoIcon from '../Logo/logoIcon.png'

export function LayoutComponent() {
  const { user, removeUserFromContext} = useContext(AuthContext);
  const navigate = useNavigate();

  async function logout() {
    try {
      await axios.post(API_BASE_URL + "/logout");
      removeUserFromContext();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="App">
      {
        user ? (
          <>
            <nav className="navbar">
            <a href="/"><img className="icon" src={logoIcon} alt="triviahack logo"/></a>
                <NavLink to="/home">Play</NavLink>

                <NavLink to="/profile">Profile</NavLink>

                <NavLink to="/quiz/list">My Quizzes</NavLink>

                <button onClick={logout}>Logout</button>
            </nav>

            <Outlet />
          </>
        ) : (
          // does this work? pass error message along: "Please login to access these pages?"
          navigate("/")
        )

      }
    </div>
  );
}

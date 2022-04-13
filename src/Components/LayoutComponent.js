import axios from "axios";
import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProviderWrapper";
import { API_BASE_URL } from "../consts";
import logoIcon from '../Logo/logoIcon.png'
import cover_photo from '../Logo/cover_photo.png'

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
              <div className="logoAndIcon">
                <img className="icon" src={logoIcon} alt="triviahack logo"/>
                <p>TRIVIAHACK</p>
              </div>
    
                <NavLink to="/home">
                <i class="material-icons-outlined md-18">play_circle</i>
                {/* &#160;Play */}</NavLink>

                <NavLink to="/profile">
                <i class="material-icons-outlined md-18">account_circle</i>
                {/* &#160;Profile */}</NavLink>

                <NavLink to="/quiz/list">
                <i class="material-icons-outlined md-18">list_alt</i>
                {/* &#160;My Quizzes */}</NavLink>

                <button onClick={logout}>
                <i class="material-icons-outlined md-18">logout</i>
                {/* &#160;Logout */}</button>
            </nav>

            <Outlet />
          </>
        ) : (
          // does this work? pass error message along: "Please login to access these pages?"
          //navigate("/")
          <>
            <nav className="navbar">
                <div className="logoAndIcon">
                  <img className="icon" src={logoIcon} alt="triviahack logo"/>
                  <p>TRIVIAHACK</p>
                </div>

                  <NavLink to="/">
                  Login
                  {/* &#160;Play */}</NavLink>

                  <NavLink to="/signup">
                  Sign Up
                  {/* &#160;Profile */}</NavLink>
              </nav>
              <div className="page404">
                <img src={cover_photo} alt="triviahack logo"/>
                <h3>You need to be logged in to play our game!</h3>
              </div>
          </>
        )

      }
    </div>
  );
}

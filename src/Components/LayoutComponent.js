import axios from "axios";
import { useContext } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProviderWrapper";
import { API_BASE_URL } from "../consts";
import logoIcon from '../Logo/logoIcon.png'
import cover_photo from '../Logo/cover_photo.png'

export function LayoutComponent() {
  const { user, removeUserFromContext} = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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
    
              {
                 location.pathname === "/categories"
              || location.pathname === "/level" 
              || location.pathname === "/quiz-single-player" 
              || location.pathname === "/quiz-multiplayer" 
              ? (<></>) :
                <>
                  <NavLink to="/home">
                    <div className="navbarDiv">
                      <i class="material-icons-outlined md-18">play_circle</i>
                      <p className="btnName">Play</p>
                    </div>
                  </NavLink>

                  <NavLink to="/profile">
                    <div className="navbarDiv">
                      <i class="material-icons-outlined md-18">account_circle</i>
                      <p className="btnName">Profile</p>
                    </div>
                  </NavLink>

                  <NavLink to="/quiz/list">
                    <div className="navbarDiv">
                      <i class="material-icons-outlined md-18">list_alt</i>
                      <p className="btnName">My Quizzes</p>
                    </div>
                  </NavLink>

                  <button onClick={logout}>
                    <div className="navbarDiv">
                      <i class="material-icons-outlined md-18">logout</i>
                      <p className="btnName">Logout</p>
                    </div>
                  </button>
                </>}
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

import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProviderWrapper";
import { API_BASE_URL } from "../consts";
import logoIcon from '../Logo/logoIcon.png'
import cover_photo from '../Logo/cover_photo.png'

export function LayoutComponent() {
  const [ user, setUser ] = useState(useContext(AuthContext).user);
  const [ showNeedLoginPage, setShowNeedLoginPage ] = useState(false);
  const { addUserToContext, removeUserFromContext} = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) getUserSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function logout() {
    try {
      await axios.post(API_BASE_URL + "/logout");
      removeUserFromContext();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  async function getUserSession() {
    try {
      const response = await axios.get(API_BASE_URL + "/logged");
      if (response.data.user) {
        addUserToContext(response.data.user);
        setUser(response.data.user);
        setShowNeedLoginPage(false);
      } else {
        setShowNeedLoginPage(true);
      }
    } catch (error) {
      console.log(error);
    }
  } 

  const determineStyle = ({ isActive }) => {
    return {
      color: isActive ? "5aa8ba" : "white",
    };
  };

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
              ? (<></>)
              : 
              <>
                  <NavLink style={determineStyle} to="/home">
                    <div className="navbarDiv">
                      <i class="material-icons-outlined md-18">play_circle</i>
                      <p className="btnName">Play</p>
                    </div>
                  </NavLink>

                  <NavLink style={determineStyle} to="/profile">
                    <div className="navbarDiv">
                      <i class="material-icons-outlined md-18">account_circle</i>
                      <p className="btnName">Profile</p>
                    </div>
                  </NavLink>

                  <NavLink style={determineStyle} to="/quiz/list">
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
        ) : 
          showNeedLoginPage &&
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
      }
    </div>
  );
}

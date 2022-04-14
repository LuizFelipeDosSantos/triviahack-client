import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProviderWrapper";
import { API_BASE_URL } from "../consts";
import logoIcon from '../Logo/logoIcon.png'
import cover_photo from '../Logo/cover_photo.png'

export function LayoutComponent() {
  const [ user, setUser ] = useState(useContext(AuthContext).user);
  const [ showNeedLoginPage, setShowNeedLoginPage ] = useState(false);
  const { addUserToContext, removeUserFromContext} = useContext(AuthContext);
  const navigate = useNavigate();

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

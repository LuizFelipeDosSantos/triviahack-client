import axios from "axios";
import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProviderWrapper";
import { API_BASE_URL } from "../consts";

export function LayoutComponent() {
  const { user, removeUserFromContext} = useContext(AuthContext);
  const navigate = useNavigate();

  async function logout() {
    try {
      const response = await axios.post(API_BASE_URL + "/logout");
      console.log(response.data);
      removeUserFromContext();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      {
        user ? (
          <>
            <nav className="navbar">
              <NavLink to="/home">TRIVIAHACK</NavLink>

              <NavLink to="/profile">Profile</NavLink>

              <NavLink to="/quiz/create">Create Quiz</NavLink>

              <button onClick={logout}>Logout</button>
            </nav>

            <Outlet />
          </>
        ) : (
          navigate("/login")
        )

        // does this work? pass error message along: "Please login to access these pages?"
      }
    </div>
  );
}

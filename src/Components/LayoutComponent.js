import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProviderWrapper";

export function LayoutComponent() {
  const { user } = useContext(AuthContext);

  async function logout() {
    try {
        const response = await axios.post(API_BASE_URL + "/logout");
        removeUserFromContext();
        navigate("/login");
      } catch (err) {
        console.log(err);
        alert("there was an error logging out");
      }
    };

  return (
    <div>
        {user ? (
            <>
                <nav>
                    <NavLink to="/home"> 
                        TRIVIAHACK
                    </NavLink>

                    <NavLink to="/profile">
                        Profile
                    </NavLink>

                    <NavLink to="/quiz/create">
                        Create Quiz
                    </NavLink>

                    <button onClick={logout}>Logout</button>
                </nav>

                <Outlet />
            </>
        ) : { useNavigate("/login") }
        {/* does this work? pass error message along: "Please login to access these pages?" */}
        }
    </div>
  );
}
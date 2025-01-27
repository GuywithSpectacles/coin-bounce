import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";
import { useSelector } from "react-redux"; // to read the state of the user
import { signout } from "../../api/internal";
import { resetUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";

function Navbar() {
  const isAuthenticated = useSelector((state) => state.user.auth);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await signout()
      dispatch(resetUser());
    }
    catch(err){
      return (err);
    }
  }
  return (
    <>
      <nav className={styles.navbar}>
        <NavLink to={"/"} className={`${styles.logo} ${styles.inActiveStyle}`}>
          CoinBounce
        </NavLink>

        <NavLink
          to={"/"}
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Home
        </NavLink>

        <NavLink
          to={"crypto"}
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          CryptoCurrencies
        </NavLink>

        <NavLink
          to={"blogs"}
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Blogs
        </NavLink>

        <NavLink
          to={"submit"}
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Submit a blog
        </NavLink>

        {isAuthenticated ? (
          <div>
            <NavLink>
              <button className={styles.signOutButton} onClick={handleSignOut}>Sign Out</button>
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink
              to={"login"}
              className={({ isActive }) =>
                isActive ? styles.activeStyle : styles.inActiveStyle
              } 
            >
              <button className={styles.logInButton}>Log In</button>
            </NavLink>

            <NavLink
              to={"signup"}
              className={({ isActive }) =>
                isActive ? styles.activeStyle : styles.inActiveStyle
              }
            >
              <button className={styles.signUpButton}>Sign Up</button>
            </NavLink>
          </div>
        )}
      </nav>
      <div className={styles.separator}></div>
    </>
  );
}

export default Navbar;

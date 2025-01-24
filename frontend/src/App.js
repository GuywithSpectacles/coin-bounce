import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import Home from "./pages/home/home";
import styles from "./App.module.css";
import Protected from "./components/protected/protected";
import Error from "./pages/error/error";

function App() {
  const isAuth = true;
  return (
    /* <> is a react fragment, to return only one component */
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <Routes>
            <Route
              path="/"
              exact
              element={
                <div className={styles.main}>
                  <Home />
                </div>
              }
            />

            <Route
              path="crypto"
              exact
              element={
                <div className={styles.main}>
                  <h1>Crypto Page</h1>
                </div>
              }
            />

            <Route
              path="blogs"
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                  <h1>Blog Page</h1>
                </div>
                </Protected>
                
              }
            />

            <Route
              path="submit"
              exact
              element={
                <Protected isAuth={isAuth}>
                <div className={styles.main}>
                  <h1>Blog Page</h1>
                </div>
                </Protected>
              }
            />

            <Route
              path="log-in"
              exact
              element={
                <div className={styles.main}>
                  <h1>Log In Page</h1>
                </div>
              }
            />

            <Route
              path="sign-up"
              exact
              element={
                <div className={styles.main}>
                  <h1>Sign Up Page</h1>
                </div>
              }
            />

            <Route
              path="*"
              exact
              element={
                <div className={styles.main}>
                  <Error />
                </div>
              }
            />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

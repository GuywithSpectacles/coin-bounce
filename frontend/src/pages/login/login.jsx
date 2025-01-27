import { useState } from "react";
import styles from "./login.module.css";
import TextInput from "../../components/textInput/textInput";
import { loginSchema } from "../../schemas/loginSchema";
import { useFormik } from "formik"; //for form validation
import { login } from "../../api/internal";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux"; // Coz we need to Write the state
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const data = {
        userName: values.userName,
        password: values.password,
      };
      const response = await login(data);
      
      if (response.status === 201) {
        const user = {
          _id: response.data.user._id,
          userName: response.data.user.userName,
          email: response.data.user.email,
          auth: response.data.auth,
        };
        dispatch(setUser(user));
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200
        setError(error.response.data.message);
      } else {
        // Network error or no response
        setError('An unexpected error occurred');
      }
    }
  };
  

  //          values, errors, handle intereaction, handleBlur, handle value change
  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: loginSchema,
  });

  if (errors.userName && touched.userName) {
    console.log(errors.userName);
  }

  return (
    <div className={styles.loginWapper}>
      <div className={styles.loginHeader}>Log into your account</div>
      <TextInput
        type="text"
        value={values.userName}
        name="userName"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Username"
        error={errors.userName && touched.userName ? 1 : undefined}
        errormessage={errors.userName}
      />
      <TextInput
        type="password"
        value={values.password}
        name="password"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Password"
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />
      <button className={styles.loginButton} onClick={handleLogin}>Login</button>
      <span>
        Don't have an account?
        <button className={styles.createAccount} onClick={() => navigate("/signup")}>Sign Up</button>
      </span>
      {error !== "" ? <p className={styles.errorMessage}>{error}</p> : ""}
    </div>
  );
}

export default Login;

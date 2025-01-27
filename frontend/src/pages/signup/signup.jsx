import { useState } from "react";
import styles from "./signup.module.css";
import TextInput from "../../components/textInput/textInput";
import { signupSchema } from "../../schemas/signupSchema";
import { useFormik } from "formik"; //for form validation
import { signup } from "../../api/internal";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux"; // Coz we need to Write the state
import { useNavigate } from "react-router-dom";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const data = {
        userName: values.userName,
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };
      const response = await signup(data);
      if (response.status === 201) {
        const user = {
          _id: response.data.user._id,
          userName: response.data.user.userName,
          email: response.data.user.email,
          auth: response.data.auth,
        };
        dispatch(setUser(user));
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200
        setError(error.response.data.message);
      } else {
        // Network error or no response
        setError("An unexpected error occurred");
      }
    }
  };

  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      userName: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
    onSubmit: handleSignup,
  });

  return (
    <div className={styles.signupWapper}>
      <div className={styles.signupHeader}>Create an Account</div>
      <TextInput
        label="Username"
        name="userName"
        type="text"
        value={values.userName}
        onChange={handleChange}
        placeholder="Username"
        onBlur={handleBlur}
        error={touched.userName && errors.userName ? 1 : undefined}
        errormessage={errors.userName}
      />

      <TextInput
        label="Name"
        name="name"
        type="text"
        value={values.name}
        onChange={handleChange}
        placeholder="Name"
        onBlur={handleBlur}
        error={touched.name && errors.name ? 1 : undefined}
        errormessage={errors.name}
      />

      <TextInput
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        placeholder="Email"
        onBlur={handleBlur}
        error={touched.email && errors.email ? 1 : undefined}
        errormessage={errors.email}
      />

      <TextInput
        label="Password"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        placeholder="Password"
        onBlur={handleBlur}
        error={touched.password && errors.password ? 1 : undefined}
        errormessage={errors.password}
      />

      <TextInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        onBlur={handleBlur}
        error={
          touched.confirmPassword && errors.confirmPassword ? 1 : undefined
        }
        errormessage={errors.confirmPassword}
      />

      <button
        type="submit"
        className={styles.signupButton}
        onClick={handleSignup}
      >
        Signup
      </button>
      <span>
        Already have an account?{" "}
        <button
          className={styles.loginButton}
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
      </span>
      {error !== "" ? <p className={styles.errorMessage}>{error}</p> : ""}
    </div>
  );
}

export default Signup;

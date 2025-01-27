import * as yup from "yup";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const errorMessage = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number';

export const signupSchema = yup.object().shape({
    userName: yup.string().min(5).max(30).required('Username is required'),
    name: yup.string().max(30).required('Name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(8).max(25).matches(passwordPattern, { message: errorMessage }).required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
});

export default signupSchema;
import * as yup from "yup"; // use to define the schema

export const loginSchema = yup.object().shape({
    userName: yup.string().min(5).max(30).required('Username is required'),
    password: yup.string().min(8).max(30).required('Password is required'),
});
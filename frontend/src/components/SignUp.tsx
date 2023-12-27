import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../utils/journal_api";
import * as JournalsApi from "../utils/journal_api";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/SignUpLoginForm.module.css"
import 'react-toastify/dist/ReactToastify.css';
import { errorMessage, successMessage } from "../utils/toastMessage";
import { ApiError } from "../utils/journal_api";

interface SignUpProps {
  //onSignUpClicked: () => void,
    onSignUpSuccessful: (user: User) => void;
}

const SignUp = ({  onSignUpSuccessful }: SignUpProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
} = useForm<SignUpCredentials>();

const password = watch("password");
const confirmPassword = watch("confirmPassword");

    const [emailTakenError, setEmailTakenError] = useState("");


    async function onSubmit(credentials: SignUpCredentials) {
      // Clear any existing errors
      setEmailTakenError("");
      try {
        const newUser = await JournalsApi.signUp(credentials);
        onSignUpSuccessful(newUser);
      } catch (error) {
        console.error("Error in submission:", error);
        if (error instanceof ApiError) {
          setEmailTakenError(error.message); //email already taken
          //alert(error.message);
        } else {
          alert("An unknown error occurred.");
          console.error(error);
        }
      }
    }

    return (
        <div className={styles.container}>
      <h1 className={styles.title}>MOODY</h1>
      <div className="p-5 border rounded shadow-sm" style={{ backgroundColor: '#f2f1e8' }}>
        <h5 className="mb-3 text-center" style={{ color: '#7b9e87' , fontSize: '2rem'}}>Sign Up</h5>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              placeholder="Email Address"
              className={`form-control form-control-lg ${errors.email || emailTakenError ? 'is-invalid' : ''}`}
              id="email"
              {...register('email', { required: true })}
            />
            {errors.email && <div className="invalid-feedback">Email is required</div>}
            {emailTakenError && <div className="text-danger">{emailTakenError}</div>}
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              {...register('password', { 
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long"
                },
                maxLength: {
                  value: 20,
                  message: "Password must not exceed 20 characters"
                }
              })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            <small id="passwordHelpBlock" className="form-text text-muted">
              Your password must be 8-20 characters long.
            </small>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              className={`form-control form-control-lg ${
                errors.confirmPassword ? 'is-invalid' : ''
              }`}
              id="confirmPassword"
              {...register('confirmPassword', {
                required: "Confirmation password is required",
                validate: value => value === password || "Passwords do not match"
              })}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
            <small id="passwordHelpBlock" className="form-text text-muted">
              Your password must be 8-20 characters long.
            </small>
          </div>

          <div className="d-flex justify-content-between">
          <button type="button" className={styles.linkBtn} disabled={isSubmitting}>
              <Link to="/"  className={styles.link}>
                Login
              </Link>
            </button>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isSubmitting}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      
    </div>
       
    );
};

export default SignUp;

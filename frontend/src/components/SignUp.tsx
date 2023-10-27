import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../utils/journal_api";
import * as JournalsApi from "../utils/journal_api";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/SignUpLoginForm.module.css"

interface SignUpProps {
  //onSignUpClicked: () => void,
    onSignUpSuccessful: (user: User) => void;
}

const SignUp = ({  onSignUpSuccessful }: SignUpProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpCredentials>();


    async function onSubmit(credentials: SignUpCredentials) {
        if (credentials.password !== credentials.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const newUser = await JournalsApi.signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            alert(error);
            console.error(error);
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
              className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              {...register('email', { required: true })}
            />
            {errors.email && <div className="invalid-feedback">Email is required</div>}
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
              {...register('password', { required: true })}
            />
            {errors.password && <div className="invalid-feedback">Password is required</div>}
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
              {...register('confirmPassword', { required: true })}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">Confirmation password is required</div>
            )}
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

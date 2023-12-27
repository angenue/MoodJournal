import { useForm } from "react-hook-form";
import { useState } from "react"
import { Link } from "react-router-dom";
import { User } from '../models/user';
import styles from "../styles/SignUpLoginForm.module.css";
import * as JournalsApi from "../utils/journal_api";
import { LoginCredentials } from '../utils/journal_api';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ApiError } from "../utils/journal_api";
import ImageGallery from './ImageGallery'; 
import Footer from "./Footer";

interface LoginProps {
    
    onLoginSuccessful: (user: User) => void;
}

const Login = ({ onLoginSuccessful}: LoginProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginCredentials>();
    const navigate = useNavigate();

    const [authError, setAuthError] = useState("");



    async function onSubmit(credentials: LoginCredentials) {
      //setAuthError("");

        try {
            const user = await JournalsApi.login(credentials);
            onLoginSuccessful(user);
            //navigate('/Home');
        } catch (error) {
          
          if (error instanceof ApiError) {
            setAuthError(error.message); 
        } else {
            // Handle cases where it's not an Error object
            console.error('Caught error of unknown type:', error);
            alert('An unknown error occurred');
          }
        }
    }


  return (
     <div className={styles.container}>
      <h1 className={styles.title}>MOODY</h1>
      <div className={styles.formContainer + " p-5 border rounded shadow-sm"} style={{ backgroundColor: '#f2f1e8', maxWidth: '500px', margin: '0 auto' }}>
        <h5 className="mb-3 text-center" style={{ color: '#7b9e87', fontSize: '2rem' }}>Login</h5>

        <form onSubmit={handleSubmit(onSubmit)}>
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
            
          </div>

          {authError && <div className="alert alert-danger">{authError}</div>}

          <div className="d-flex justify-content-between">
            <button type="button" className={styles.linkBtn}  disabled={isSubmitting}>
              <Link to="/SignUp" className={styles.link}>
                Sign Up
              </Link>
            </button>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isSubmitting}
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <ImageGallery />
      <Footer/>
    </div>
  );
};

export default Login;

import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../utils/journal_api";
import * as JournalsApi from "../utils/journal_api";

interface SignUpProps {
    onDismiss: () => void;
    onSignUpSuccessful: (user: User) => void;
}

const SignUp = ({ onDismiss, onSignUpSuccessful }: SignUpProps) => {
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
        <div
            className="modal fade show"
            tabIndex={-1}
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Sign Up</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onDismiss}
                        ></button>
                    </div>


                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    id="email"
                                    {...register("email", { required: true })}
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">Email is required</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={`form-control ${errors.password ? "is-invalid" : ""
                                        }`}
                                    id="password"
                                    {...register("password", { required: true })}
                                />
                                {errors.password && (
                                    <div className="invalid-feedback">Password is required</div>
                                )}
                                <small id="passwordHelpBlock" className="form-text text-muted">
  Your password must be 8-20 characters long.
</small>
                            </div>


                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""
                                        }`}
                                    id="confirmPassword"
                                    {...register("confirmPassword", { required: true })}
                                />
                                {errors.confirmPassword && (
                                    <div className="invalid-feedback">
                                        Confirmation password is required
                                    </div>
                                )}
                                <small id="passwordHelpBlock" className="form-text text-muted">
  Your password must be 8-20 characters long.
</small>
                            </div>
                        </div>

                        
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onDismiss}
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

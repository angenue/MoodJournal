import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async(req, res, next) => {
    const authenticatedUserId= req.session.userId;

    try {
        if (!authenticatedUserId) {
            throw createHttpError(401, "User not authenticated");
        }

        const user = await UserModel.findById(authenticatedUserId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

interface SignUpBody {
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if( !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingEmail = await UserModel.findOne({ email: email}).exec();

        if (existingEmail) {
            throw createHttpError(409, "User with this email address already exists.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            email: email,
            password: passwordHashed,
        });

        req.session.userId = newUser._id;

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    email?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
         if (!email || !password) {
            throw createHttpError(400, "Parameters missing");
         }   

         const user = await UserModel.findOne({email: email}).select("+password +email").exec();

         if (!user) {
            throw createHttpError(401, "Invalid credentials");
         }

         const passwordMatch = await bcrypt.compare(password, user.password);

         if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials"); 
         }

         req.session.userId = user._id;
         res.status(201).json(user);
    }
     catch (error) {
        next(error);
    }
}

export const logout:RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        }
        else {
            res.sendStatus(200);
        }
    })
}
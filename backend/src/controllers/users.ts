import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async(req, res, next) => {
    try {
    
        const user = await UserModel.findById(req.session.userId).select("+email").exec();
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
            return res.status(409).json({ message: "Email already in use" });
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
            //throw createHttpError(401, "Invalid credentials");
            return res.status(401).json({ message: "Invalid Credentials" });
         }

         const passwordMatch = await bcrypt.compare(password, user.password);

         if (!passwordMatch) {
            //throw createHttpError(401, "Invalid credentials"); 
            return res.status(401).json({ message: "Invalid Credentials" });
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
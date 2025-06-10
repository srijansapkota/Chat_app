import jwt from "jsonwebtoken";
import User from "../models/user.model.js";



export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const user = await User.findById(decoded.UserID).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.log(error);
         res.staus(500).json({ message: "Server error" });
        
    }

}
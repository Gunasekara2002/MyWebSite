import jwt from "jsonwebtoken";

export const genarteToken = (userId) => {
    return jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });
}

export default genarteToken;
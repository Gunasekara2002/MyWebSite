import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/jwtToken.js";

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try{
        const existingUser = await User.findOne({email}); // Renamed to avoid conflict
        if (existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });
        await newUser.save();
        res.status(201).json({message: "User Registered Successfully", user: newUser});
    }
    catch (error){
        res.status(500).json({message: "Internal server error", error});
    }
};

// Get all users
export const getAllUser = async (req, res) => {
    try{
        const users = await User.find(); // Fixed variable name conflict
        if(!users || users.length === 0) {
            return res.status(404).json({message:"No users found"});
        }
        res.json(users);
    }
    catch(error){
        res.status(500).json({message:"Internal server error", error});
    }
}

// Get a user by Id
export const getUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id); // Fixed variable name
        if (!user) {
            return res.status(404).json({ message:'User not found'}); // Fixed return statement
        }
        res.json(user);
    }
    catch (error){
        res.status(500).json({message:'Error fetching user', error});
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Filter user by name
export const filterUserByName = async (req, res) => {
    try{
        const users = await User.find({ name: new RegExp(req.query.name, "i")}); // Fixed variable name
        res.json(users);
    }
    catch(error){
        console.log("Error in filter user", error);
        res.status(500).json({message:"Server error", error: error.message});
    }
};

// Login user
export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email}); // Fixed: findOne instead of findone
        if(!user) return res.status(400).json({message:"User not found"});
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid password"});
        
        const token = generateToken(user._id);
        res.status(200).json({
            message:"User logged in successfully",
            user:{
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        }); 
    }
    catch(error){
        console.log("Error in login user", error);
        res.status(500).json({message:"Server error", error: error.message});
    }
};
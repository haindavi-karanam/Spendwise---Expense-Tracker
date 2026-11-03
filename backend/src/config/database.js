import mongoose from "mongoose";

const connectDB = async() =>{
    try {
        const connectionInstance = await mongoose.connect
        (`${process.env.MONGODB_URI}`);
        console.log(`\n Mongodb connected successfully 
            ${connectionInstance.connection.host}`);
    } catch (err) {
        console.log("Mongodb failed", err.message)
       throw err;
       
    }
};


export default connectDB;
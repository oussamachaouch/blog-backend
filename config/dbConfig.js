import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('database connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
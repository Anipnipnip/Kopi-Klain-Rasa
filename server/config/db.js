const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () =>
      console.log("Database Connected")
    );

    await mongoose.connect(`${process.env.MONGODB_URI}/klainrasa`);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB;
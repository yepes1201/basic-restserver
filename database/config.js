const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log("connected");
  } catch (err) {
    console.log(err);
    throw new Error("No se puedo conectar.");
  }
};

module.exports = {
  dbConnection,
};

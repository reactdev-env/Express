const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://reactdevenv:Saibaba%40123@clusterdev.w7u1bsp.mongodb.net/pavanDev");
};

module.exports= connectDB;

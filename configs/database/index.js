const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    await mongoose.connect(
      "mongodb+srv://loveUsBwd:6MvdupdaxCX6vawE@cluster0.hxujo.mongodb.net/DB_LOVE_US?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connect mongo successfully ");
  } catch (e) {
    console.log("Connect mongo failed: " + e.message);
  }
}

module.exports = connectDatabase;

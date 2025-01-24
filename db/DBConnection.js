const mongoose = require("mongoose");

const DBConnection = async () => {
  const MONGURL = process.env.MONGODBURL;
  console.log("MONGURL", MONGURL);
  try {
    const connect = await mongoose.connect(
      `mongodb+srv://shaiksameer6061:smartx@cluster0.l819g.mongodb.net/smartx_chat_user`
    );
    if (connect.connection.host) {
      console.log(
        `SUCCESFULLY DATABASE CONNECTED ON HOST ${connect.connection.host}`
      );
    }
  } catch (err) {
    console.log(`while Connecting DB ${err}`);
    return process.exit();
  }
};

module.exports = DBConnection;

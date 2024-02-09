const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let URI;
if (process.env.NODE_ENV === "development") {
  URI = `mongodb://localhost:27017/taskBoard`;
} else {
  URI = `mongodb+srv://${process.env.NODE_MONGO_DB_USERNAME}:${process.env.NODE_MONGO_DB_PASSWORD}@taskmanagementboardatla.4gngqoj.mongodb.net/${process.env.NODE_MONGO_DB_NAME}?retryWrites=true&w=majority`; 
}


mongoose
  .connect(`${URI}`)
  .then((response) => {
    console.log('MongoDB connected')
    console.log("RESPONSE::", response);
    console.log("CONNECT TO::", URI);
  })
  .catch((error) => {
    console.log("ERROR CONNECTINMG TO DATABASE::", error);
  });
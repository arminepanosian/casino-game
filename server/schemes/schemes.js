const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BlogSchema = new Schema({
  username: { type: String, trim: true, required: true , unique: true },
  password: { type: String, trim: true, minlength: 8, required: true },
  spins: { type: Number , default: 0 },
  AllSpins: { type: Number , default: 0 },
  history: [],
});



const UsersModel = model("users", BlogSchema);
module.exports.BlogModel = UsersModel;




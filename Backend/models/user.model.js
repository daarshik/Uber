const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    minlength: [5, "Email must be at least 3 characters long"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;

// 1. .methods
// These are instance methods — they are used on individual documents.

// So when you write:

// userSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };
// You’re saying:
// 👉 "For a specific user document, add a method called comparePassword that compares the entered password with this user's stored hashed password."

// 2. .statics
// These are model-level methods — they are used on the model itself, not on individual documents.

// userSchema.statics.hashPassword = async function (password) {
//   return await bcrypt.hash(password, 10);
// };
// You're saying:
// 👉 "Attach a utility function called hashPassword to the model so I can use it without needing a user document."

// 🔹 Document
// A document is a single record in MongoDB, stored in JSON-like format (specifically BSON: Binary JSON).
// {
//   "_id": "64a4c2d2d77e3b0e9a88d9a4",
//   "name": "Daarshik",
//   "email": "daarshik@example.com",
//   "age": 24
// }
// This is one document. It's like a row in a traditional SQL database.

// 🔹 Collection
// A collection is a group of documents. It’s like a table in SQL.

// Example:
// A users collection might contain:

// [
//   { "name": "Daarshik", "email": "d@example.com", "age": 24 },
//   { "name": "Ravi",     "email": "r@example.com", "age": 27 },
//   { "name": "Aditi",    "email": "a@example.com", "age": 22 }
// ]
// All of these documents are stored inside the users collection.

// The line:

// mongoose.model("user", userSchema);
// is part of how you define a model in Mongoose (which is an ODM—Object Data Modeling library for MongoDB and Node.js). Here's what it means:

// Explanation
// mongoose.model(...):
// This function creates a model from a schema.

// "user":
// This is the name of the model. Mongoose will automatically convert it to the plural, lowercase version to use as the collection name in MongoDB.
// So, "user" → "users" collection.

// userSchema:
// This is the Mongoose schema object that defines the structure, validation rules, defaults, etc., for documents in the collection.

// In Short:
// This line tells Mongoose:

// “Create a model called User using the userSchema. Use the users collection in MongoDB to store these documents.”

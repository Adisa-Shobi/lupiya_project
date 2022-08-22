const mongoose = require("mongoose")

const User = mongoose.model(
    "Role",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        role: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    })
);
module.exports = User;
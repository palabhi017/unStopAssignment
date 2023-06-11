const mongoose = require("mongoose")

const seatSchema = new mongoose.Schema({
    seatNumber: Number,
    isBooked: Boolean,
})

const seatModel = mongoose.model("seat",seatSchema)

module.exports = {seatModel}

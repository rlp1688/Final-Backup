const mongoose = require('mongoose');

const statusSchema = new mmongoose.Schema({
    status: {
        type: Boolean,
        required: true
    }
});

const Status = mongoose.model("Status", statusSchema);
module.exports = Status;
var mongoose = require("mongoose")
    mongoose.connect("mongodb://localhost/test")
    Message = mongoose.model('Message', { text: String });

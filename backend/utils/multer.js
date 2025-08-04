const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb){
        const name = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, name + '-' + file.originalname);
    }
})


const upload = multer({storage: storage})

module.exports = upload;
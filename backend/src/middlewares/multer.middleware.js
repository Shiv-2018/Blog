import multer from "multer";

// multer configuration for file uploads
// This configuration saves the uploaded files to the "./public/temp" directory
// and uses the original file name for the uploaded files.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})
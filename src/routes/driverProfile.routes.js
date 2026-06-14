const router = require('express').Router();
const auth = require("../middleware/authMiddleware");
// نفس middleware اللى بتستخدميه فى service-areas
const upload = require('../middleware/upload');
const c = require('../controllers/driverProfileController');

router.get('/profile', auth, c.getProfile);

router.post(
  '/profile',
  auth,
  upload.fields([
    { name: 'photo',   maxCount: 1 },
    { name: 'license', maxCount: 1 },
    { name: 'vehicle', maxCount: 1 },
  ]),
  c.upsertProfile
);

module.exports = router;

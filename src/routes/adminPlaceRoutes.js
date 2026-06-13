const express = require("express");
const router = express.Router();

const {
  getPendingPlaces,
  getAllPlaces,
  acceptPlace,
  deletePlace,
  rejectPlace,
} = require("../controllers/adminPlaceController");

router.get("/places", getAllPlaces);

router.get("/places/pending", getPendingPlaces);

router.patch("/places/:id/accept", acceptPlace);

router.patch("/places/:id/reject", rejectPlace);

router.delete("/places/:id", deletePlace);

module.exports = router;

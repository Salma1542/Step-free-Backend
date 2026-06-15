const Place = require("../models/Place");



const getPendingPlaces = async (req, res) => {
 try {
 const places = await Place.find({
 status: "pending",
 }).sort({ createdAt: -1 });

 res.status(200).json({
 success: true,
 count: places.length,
 data: places,
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message,
 });
 }
};

const acceptPlace = async (req, res) => {
 try {
 const place = await Place.findById(req.params.id);

 if (!place) {
 return res.status(404).json({
 success: false,
 message: "Place not found",
 });
 }

 place.status = "accepted";

 await place.save();

 res.status(200).json({
 success: true,
 message: "Place accepted successfully",
 data: place,
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message,
 });
 }
};

const deletePlace = async (req, res) => {
 try {
 const place = await Place.findById(req.params.id);

 if (!place) {
 return res.status(404).json({
 success: false,
 message: "Place not found",
 });
 }

 await Place.findByIdAndDelete(req.params.id);

 res.status(200).json({
 success: true,
 message: "Place deleted successfully",
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message,
 });
 }
};

const getAllPlaces = async (req, res) => {
 try {
 const places = await Place.find().sort({ createdAt: -1 });

 res.status(200).json({
 success: true,
 count: places.length,
 data: places,
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message,
 });
 }
};
const rejectPlace = async (req, res) => {
 try {
 const place = await Place.findById(req.params.id);

 if (!place) {
 return res.status(404).json({
 success: false,
 message: "Place not found",
 });
 }

 place.status = "rejected";
 await place.save();

 res.status(200).json({
 success: true,
 message: "Place rejected successfully",
 data: place,
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message,
 });
 }
};

module.exports = {
 getPendingPlaces,
 getAllPlaces,
 acceptPlace,
 rejectPlace,
 deletePlace,
};
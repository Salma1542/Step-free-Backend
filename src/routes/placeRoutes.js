// src/routes/placeRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  getNearbyPlaces,
} = require("../controllers/placeController");

/**
 * @swagger
 * /places:
 *   get:
 *     tags:
 *       - Places
 *     summary: Get all places
 *     parameters:
 *       - in: query
 *         name: categorygit checkout places2
 *         schema:
 *           type: string
 *           enum: [Restaurant, Hospital, Mall, Hotel, Cafe, Bank]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/", getAllPlaces);

/**
 * @swagger
 * /places/nearby:
 *   get:
 *     tags:
 *       - Places
 *     summary: Get nearby places
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *           default: 5000
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 */
router.get("/nearby", getNearbyPlaces);

/**
 * @swagger
 * /places/{id}:
 *   get:
 *     tags:
 *       - Places
 *     summary: Get place by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
router.get("/:id", getPlaceById);

/**
 * @swagger
 * /places:
 *   post:
 *     tags:
 *       - Places
 *     summary: Create new place
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Place'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.post("/", createPlace);

/**
 * @swagger
 * /places/{id}:
 *   put:
 *     tags:
 *       - Places
 *     summary: Update place
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Place'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put("/:id", updatePlace);

/**
 * @swagger
 * /places/{id}:
 *   delete:
 *     tags:
 *       - Places
 *     summary: Delete place
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete("/:id", deletePlace);

module.exports = router;
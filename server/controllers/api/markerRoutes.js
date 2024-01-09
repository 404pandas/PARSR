const router = require('express').Router();
const { Marker } = require('../../models');

// ROUTE /api/markers

router.get("/all", async (req, res) => {
    try {
        const markerData = await Marker.findAll();

        res.status(200).json(markerData);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
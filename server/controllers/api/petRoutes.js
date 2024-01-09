const router = require('express').Router();
const { Pet } = require('../../models');

// ROUTE /api/pets

router.get("/all", async (req, res) => {
    try {
        const petData = await Pet.findAll();

        res.status(200).json(petData);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
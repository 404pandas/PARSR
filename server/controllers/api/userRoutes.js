const router = require('express').Router();
const { User } = require('../../models');

// ROUTE /api/users

router.get("/all", async (req, res) => {
    try {
        const userData = await User.findAll();

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
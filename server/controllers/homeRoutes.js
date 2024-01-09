const router = require('express').Router();

router.get("/test", async (req, res) => {
    try {


        res.status(200).json({message: "Test Successful"});
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;

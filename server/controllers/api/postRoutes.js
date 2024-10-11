const router = require('express').Router();
const { Post } = require('../../models');

// ROUTE /api/posts

router.get("/all", async (req, res) => {
    try {
        const postData = await Post.findAll();

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
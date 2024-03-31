const express = require('express');
const router = express.Router();

router.post('/', (req,res) => {
    res.send('This is the recommendation route')
});

module.exports = router;
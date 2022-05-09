const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let titre = "Inscription";
    res.render('inscription', { titre });
});

router.post('/', (req, res) => {
    console.log(req.body);
})

module.exports = router;
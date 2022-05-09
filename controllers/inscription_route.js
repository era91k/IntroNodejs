const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let titre = "Inscription";
    res.render('inscription', { titre });
});

router.post('/', (req, res) => {
    alert('Inscription validée');
})

module.exports = router;
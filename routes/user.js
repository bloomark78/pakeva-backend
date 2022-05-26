const { Router } = require('express');
const { Cotizar } = require('../controllers/cotizador');

const router = Router();

router.post("/cotizar",Cotizar);
router.post("/");
router.put("/");
router.delete("/");


module.exports = router;
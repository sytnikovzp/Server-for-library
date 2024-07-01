const { Router } = require('express');
// ============================
const authorRouter = require('./authorRouters');
const customerRouter = require('./customerRouters');

const router = new Router();

router.use('/authors', authorRouter);
router.use('/customers', customerRouter);

module.exports = router;

const { Router } = require('express');
// ============================
const authorRouter = require('./authorRouters');

const router = new Router();

router.use('/authors', authorRouter);

module.exports = router;

const expres = require("express")
const router = expres.Router()

router.get('/', (req, res) => {
    res.render('admin/admin')
});

router.get('/manage-class', (req, res) => {
    res.render('admin/managclass')
});
router.get('/manage-student', (req, res) => {
    res.render('admin/managStudent')
});
module.exports = router
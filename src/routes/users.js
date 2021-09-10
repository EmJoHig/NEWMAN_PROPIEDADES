const router = require('express').Router();

//creo las rutas del servidor

router.get('/users/signin', (req,res) =>{
    res.send('Sign IN');
});

router.get('/users/signup', (req,res) =>{
    res.send('Sign UP');
});


module.exports = router;
const express = require('express');

const router = express.Router();

router.get('/test-me', function (req, res) {
    res.send('My first ever api. i am rahul making my first api on postman!')
});
router.get('/movie', function (req, res) {
    
    const movi=['IronMan','Chhichhore','Sooryavanshi'];
    res.send(movi)
});
router.get('/movies/:movieId', function (req, res) {
    
    let value=req.params.movieId
    // console.log(value)
    // res.send(' ')
    
    const movi=['Jai bhim','Surya','Bahubali']
     res.send(value>=movi.length ? 'use valid index':movi[value]) 
});
router.get('/films/:filmId', function (req, res) {
    
    let val=req.params.filmId
    const fil=[ {
        "id": 1,
        "name": "The Shining"
       },{
        "id": 2,
        "name": "Sholey"
       }, {
        "id": 3,
        "name": "Shadi mein Jaroor ana"
       }, {
        "id": 4,
        "name": "Transformer"
       }]
       res.send(val>=fil.length-1 ? 'No movie exits with this id':fil[val-1])
    //  res.send(value>movi.length ? 'use valid index':movi[value]) 
});

module.exports = router;
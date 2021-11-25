const express = require('express');
const router = express.Router();

const cowinController= require("../controller/cowinController")

router.get("/cowin/states", cowinController.getStatesList)
router.get("/cowin/districts/:stateId", cowinController.getDistrictsList)
router.get("/cowin/centers", cowinController.getByPin)
router.post("/cowin/getOtp", cowinController.getOtp)
router.get('/getWeather', cowinController.getWeather)
router.get('/getTemp', cowinController.getTemp)
router.get('/sortCity', cowinController.sortCity)

module.exports = router;
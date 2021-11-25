const axios = require("axios");
const { get } = require("mongoose");

// res.status(200). send( { data: userDetails } )

const getStatesList = async function (req, res) {
  try {
    let options = {
      method: "get",
      url: "https://cdn-api.co-vin.in/api/v2/admin/location/states",
    };
    const cowinStates = await axios(options);

    console.log("WORKING");
    let states = cowinStates.data;
    res.status(200).send({ msg: "Successfully fetched data", data: states });

  } 
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured" });
  }

};


const getDistrictsList = async function (req, res){

    try{ 
        let id= req.params.stateId
        console.log(" state: ", id)

        let options = {
            method: "get",
            url : `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}` //plz take 5 mins to revise template literals here
        }
        let response= await axios(options)

        let districts= response.data
        
        console.log(response.data)
        res.status(200).send( {msg: "Success", data: districts} )

    }
    catch(err) {
        console.log(err.message)
        res.status(500).send( { msg: "Something went wrong" } )
    }
}

const getByPin = async function (req, res){

    try{ 

        let pin= req.query.pincode
        let date= req.query.date

        let options = {
          method : "get",
          url : `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`
        }
        let response= await axios(options)
        


        let centers= response.data
        console.log(centers)
        res.status(200).send( {msg: "Success", data: centers} )

    }
    catch(err) {
        console.log(err.message)
        res.status(500).send( { msg: "Something went wrong" } )
    }
}


const getOtp = async function (req, res){

    try{ 

         let options = {
          method : "post", // method has to be post
          url : `https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP`,
          data: { "mobile": req.body.mobile  } // we are sending the json body in the data 
        }
        let response= await axios(options)

        let id= response.data
        res.status(200).send( {msg: "Success", data: id} )

    }
    catch(err) {
        console.log(err.message)
        res.status(500).send( { msg: "Something went wrong" } )
    }
}
// get weather

const getWeather = async function(req, res){
    try{
        let options = {
            method:"get",
            url:` http://api.openweathermap.org/data/2.5/weather?q=${req.query.q}&appid=${req.query.appid}`
        }
        let response = await axios(options)
        let id=response.data
        res.status(200).send( { msg:'success', data: id})
    }
    catch{
        res.status(400).send( { msg:'something went rong'})
    }
}
const getTemp = async function(req, res){
    try{
        let options = {
            method:"get",
            url:` http://api.openweathermap.org/data/2.5/weather?q=${req.query.q}&appid=${req.query.appid}`
        }
        let response = await axios(options)
        let id=response.data.main.temp
        res.status(200).send( { msg:'temp of London', data: id})
    }
    catch{
        res.status(400).send( { msg:'something went rong'})
    }
}
const sortCity = async function(req, res){
    try{
        let arr = ["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
        let finalArr = []
        for (let i=0;i<arr.length;i++){
        let options = {
            method:"get",
            url:` http://api.openweathermap.org/data/2.5/weather?q=${arr[i]}&appid=501c4da9141bac955a83bc7512e6bdfd`
        }
        
        let response = await axios(options)
        finalArr.push({ "city":arr[i], "temp":response.data.main.temp})
        console.log(finalArr)
        }
        // objs.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0))
        let sortArr = finalArr.sort((a,b) =>(a.temp > b.temp) ? 1 :((b.temp > a.temp) ? -1 : 0))
        console.log(sortArr)
        res.status(200).send( { msg:'success', data: sortArr})
    }
    
    catch{
        res.status(400).send( { msg:'something went rong'})
    }
}




module.exports.getStatesList = getStatesList;
module.exports.getDistrictsList = getDistrictsList;
module.exports.getByPin = getByPin;
module.exports.getOtp = getOtp;
module.exports.getWeather=getWeather
module.exports.getTemp=getTemp
module.exports.sortCity=sortCity
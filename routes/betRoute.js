const express = require("express");
const Jwt = require('jsonwebtoken');
const jwtKey = process.env.REGISTER_KEY;
const BetRoute = express.Router();
const BetController = require("../controller/bet.controller.js");
const {
    isNull,
    isUndefined,
    isEmail,
    isMobile,
    isValidtoken
  } = require("../DataVerification");


  const verifyData = (req, res, next) => {

    const Bearer = req.headers["authorization"];
    
    const data = isValidtoken(Bearer,jwtKey);
    if(data){
        req.body.userId = data.id;
        if(isNull(req.body.server) || isUndefined(req.body.server) || isNull(req.body.betType) || isUndefined(req.body.betType) || isNull(req.body.value) || isUndefined(req.body.value) || isNull(req.body.no_of_orders) ||isUndefined(req.body.no_of_orders) || isNull(req.body.contract_amount) || isUndefined(req.body.contract_amount) ){
            res.json({message:'INVALID_DATA'});
            return;
        }
        next();
    }else{
        res.json({message:'AUTH_FAILED'});
    }


   }

BetRoute.post("/", verifyData, BetController.Bet);
module.exports = BetRoute;
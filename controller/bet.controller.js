const {RegisterModel,BetParityModel,BetSapreModel,BetBconeModel,BetEmerdModel} = require('../model/model');

const Bet = async (req,res,next)=>{
    const userData = await RegisterModel.findOne({_id:req.body.userId});


    if(userData){
        const wallet = userData.wallet;
        const total = parseInt(req.body.no_of_orders)*parseInt(req.body.contract_amount);
        
        function addMinutes(date, minutes) {
            const dateCopy = new Date(date);
            dateCopy.setMinutes(date.getMinutes() + minutes);
            return dateCopy;
          }

        const getMinutes = () => {
            const date = new Date();
            let diff = (new Date()).getTimezoneOffset();
            let sum = 330 + diff;
            const newDate = addMinutes(date, sum);
            return newDate.getMinutes();
          }
        
        const getSec = () => {
            const date = new Date();
            let diff = (new Date()).getTimezoneOffset();
            let sum = 330 + diff;
            const newDate = addMinutes(date, sum);
            return newDate.getSeconds();
          }

        const getPeriod = () => {
            const date = new Date();
            let diff = (new Date()).getTimezoneOffset();
            let sum = 330 + diff;
            const newDate = addMinutes(date, sum);
            const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
            const days = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
            let y = newDate.getFullYear();
            let m = months[newDate.getMonth()];
            let d = days[newDate.getDate()];
            const min = ((newDate.getHours()) * 60) + (newDate.getMinutes());
            let minBythree = Math.floor(min / 3) + 1;
            if (minBythree.toString().length === 1) {
              minBythree = `00${minBythree}`;
            } else if (minBythree.toString().length === 2) {
              minBythree = `0${minBythree}`
            }
            return `${y}${m}${d}${minBythree}`;
          }
        const time = new Date().getTime();
        const Period = getPeriod();

        if(wallet > total){
            if(getMinutes() === 0 && (59 - getSec()) <30){
                res.json({message:'TIMEOUT'});
                return;
            }
        
            const remain = wallet - total;
            const update = await RegisterModel.updateOne({_id:req.body.userId},{wallet:remain});
            const server = req.body.server;
            let bet;
            switch (server) {
              case 'parity':
               bet = BetParityModel({userId:req.body.userId,Period:Period,time:time,betType:req.body.betType,value:req.body.value,no_of_orders:req.body.no_of_orders,contract_amount:req.body.contract_amount,total_amount:total});
                
               break;
              case 'sapre':
               bet = BetSapreModel({userId:req.body.userId,Period:Period,time:time,betType:req.body.betType,value:req.body.value,no_of_orders:req.body.no_of_orders,contract_amount:req.body.contract_amount,total_amount:total});
                break;
              case 'bcone':
               bet = BetBconeModel({userId:req.body.userId,Period:Period,time:time,betType:req.body.betType,value:req.body.value,no_of_orders:req.body.no_of_orders,contract_amount:req.body.contract_amount,total_amount:total});
                break;
              case 'emerd':
               bet = BetEmerdModel({userId:req.body.userId,Period:Period,time:time,betType:req.body.betType,value:req.body.value,no_of_orders:req.body.no_of_orders,contract_amount:req.body.contract_amount,total_amount:total});
                break;
              default:
                break;
            }
            const saveBet = await bet.save();
            res.json({message:'success',remain:remain});
        }else{
            res.json({message:'BALANCE_ERROR'});
        }

        // console.log(req.body.server,
        //     req.body.betType,
        //     req.body.value,
        //     req.body.no_of_orders,
        //     req.body.contract_amount);


    }else{
        res.json({message:'AUTH_FAILED'});
    }
}

module.exports ={Bet};
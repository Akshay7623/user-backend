const {ForgotpassModel} = require('../model/model');

const sendForgotOtp = async(req,res,next)=>{


    const userData = await ForgotpassModel.findOne({mobile:req.body.mobile});
    function generateOTP() {
        let digits = "5123456789";
        let OTP = "";
        for (let i = 0; i < 6; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return parseInt(OTP);
      }
    const mobile = req.body.mobile;
    const otp = generateOTP();
    const t = new Date().getTime();
    if (userData) {

        const diff = t - userData.time;

        if (diff / 1000 > 60) {
            const upUser = await ForgotpassModel.updateOne( { mobile: mobile }, { time: t, otp: otp,OtpTried:0 } );
            //CALLING USER API HERE 
            res.json({message:'OTP_SENT'});
        }else{
            res.json({message:'TIME_ERROR'});
        }
        
    }else{
     const otpData = ForgotpassModel({mobile:mobile,time:t,otp:otp,OtpTried:0});
     const done = await otpData.save();
     res.json({message:'OTP_SENT'});
     //calling api here only !

    }
    
    



}

module.exports = {sendForgotOtp};
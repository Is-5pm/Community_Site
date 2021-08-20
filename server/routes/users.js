const express=require('express');
const router=express.Router();

const { User } = require("../models/User"); //모델 불러오기


router.post('/register',(req,res)=>{
    const user=new User(req.body);
    user.save((err,doc)=>{
        if(err){
            return res.json({success:false,err})
        }else{
            return res.json({success:true})
        }
    })
})
router.post('/login',(req,res)=>{
    User.findOne({id:req.body.id},(err,user)=>{
        if(!user){
            return res.json({loginSuccess:false,msg:"없는 아이디"})
        }else{
            user.checkPassword(req.body.password,(err,isMatch)=>{
                if(!isMatch){
                    return res.json({loginSuccess:false,msg:"비밀번호 오류"})
                }else{
                    user.createToken((err,user)=>{
                        if(err){
                            return res.send(err)
                        }else{
                            res.cookie('auth',user.token).json({loginSuccess:true,user_id:user._id})
                        }
                    })
                }
            })
        }
    })
})
module.exports = router;
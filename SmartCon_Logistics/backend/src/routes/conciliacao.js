const router=require('express').Router();const {globalMatch}=require('../services/matcher');
router.post('/match',(req,res)=>{const {labels=[],notas=[],platform='outros',options={}}=req.body||{};res.json(globalMatch(labels,notas,platform,options))});
module.exports=router;

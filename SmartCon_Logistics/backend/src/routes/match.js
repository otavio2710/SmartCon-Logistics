const router=require('express').Router();const {pair,globalMatch}=require('../services/matcher');
router.post('/match-global',(req,res)=>{const {labels=[],notas=[],platform='outros',options={}}=req.body||{};res.json(globalMatch(labels,notas,platform,options))});
router.post('/score',(req,res)=>{const {label={},nota={},platform='outros'}=req.body||{};res.json(pair(label,nota,platform))});
module.exports=router;

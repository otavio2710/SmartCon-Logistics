require('dotenv').config();const express=require('express'),cors=require('cors'),helmet=require('helmet'),morgan=require('morgan');
const app=express();app.use(helmet({crossOriginResourcePolicy:false}));app.use(cors({origin:(process.env.CORS_ORIGIN||'http://localhost:8080').split(',').map(s=>s.trim())}));app.use(express.json({limit:process.env.JSON_LIMIT||'20mb'}));app.use(morgan('combined'));
app.get('/api/health',(req,res)=>res.json({ok:true,service:'SmartCon Logistics Backend',version:'3.0.0',profiles:['amazon','shopee','tiktok','mercadolivre','magalu','outros']}));
app.use('/api/lotes',require('./routes/lotes'));app.use('/api/conciliacao',require('./routes/conciliacao'));app.use('/api/v3',require('./routes/match'));app.use('/api/v2',require('./routes/match'));
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({erro:err.message||'Erro interno'})});
const port=+(process.env.PORT||3001);app.listen(port,()=>console.log(`SmartCon Logistics API na porta ${port}`));

require('dotenv').config();const express=require('express'),cors=require('cors'),helmet=require('helmet'),morgan=require('morgan');
const app=express();app.use(helmet({crossOriginResourcePolicy:false}));app.use(cors({origin: (process.env.CORS_ORIGIN || '').split(',').filter(Boolean).length ? process.env.CORS_ORIGIN.split(',').map(s=>s.trim()) : true}));app.use(express.json({limit:process.env.JSON_LIMIT||'20mb'}));app.use(morgan('combined'));
app.get('/api/health',(req,res)=>res.json({ok:true,service:'SmartCon Logistics Backend',version:'3.0.0',profiles:['amazon','shopee','tiktok','mercadolivre','magalu','outros']}));
app.use('/api/lotes',require('./routes/lotes'));app.use('/api/conciliacao',require('./routes/conciliacao'));app.use('/api/v3',require('./routes/match'));app.use('/api/v2',require('./routes/match'));
const path = require('path');
const frontendDir = path.join(__dirname, '../frontend');
app.use(express.static(frontendDir));
app.get('/', (req,res)=>res.sendFile(path.join(frontendDir,'index.html')));
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({erro:err.message||'Erro interno'})});
module.exports = app;
if (require.main === module) {
  const port = +(process.env.PORT || 3001);
  app.listen(port, '0.0.0.0', () => console.log(`SmartCon Logistics API na porta ${port}`));
}

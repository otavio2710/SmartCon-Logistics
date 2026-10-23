const {Pool}=require('pg');
const pool=new Pool({host:process.env.DB_HOST||'db',port:+(process.env.DB_PORT||5432),database:process.env.DB_NAME||'smartcon',user:process.env.DB_USER||'smartcon',password:process.env.DB_PASSWORD||'',max:+(process.env.DB_POOL_MAX||10)});
module.exports={query:(text,params)=>pool.query(text,params),pool};

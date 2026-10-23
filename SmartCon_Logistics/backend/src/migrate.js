require('dotenv').config(); const fs=require('fs'); const path=require('path'); const db=require('./db');
(async()=>{try{const sql=fs.readFileSync(path.join(__dirname,'migrations','001_v3.sql'),'utf8');await db.query(sql);console.log('Migração V3 OK');process.exit(0)}catch(e){console.error(e);process.exit(1)}})();

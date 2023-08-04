const app = require('./app');
const config = require('config');
const port  = config.get('app.port');
const dbUrl = config.get('db.dbUrl');
const mongoose = require('mongoose');

console.log(dbUrl);
mongoose.connect(dbUrl,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once('open',()=>{
  console.log("RMH Database connected")
});

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
});
  

//mongodb
require('./config/db')
const app = require('express')();
const port = process.env.PORT || 3000;

//cors
const cors = require('cors');
app.use(cors());

const userRouter = require('./api/User.js')

const bodyParser = require('express').json;
app.use(bodyParser());
app.use('/user', userRouter)

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})
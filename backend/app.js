const express = require('express');
const cors=require('cors')
const app = express();
const PORT = 3005
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectDb = require('./connection/connection');
connectDb();

// const userrouter = require('./routes/user/user');
// const videorouter = require('./routes/video/videoRoutes');
// const playlistrouter = require('./routes/playlist/playlist');
// const paymentrouter = require('./routes/payment/payment');
// const subscriptionplanrouter = require('./routes/subscriptionplan/subscriptionplan');
// const channelrouter=require('./routes/channel/channelRoutes')
// app.use('/api',userrouter);
// app.use('/api',videorouter);
// app.use('/api',playlistrouter);
// app.use('/api', paymentrouter);
// app.use('/api',subscriptionplanrouter);
// app.use('/api',channelrouter)
app.listen(PORT, ()=>{
    console.log(`Listining on port ${PORT}`);
})
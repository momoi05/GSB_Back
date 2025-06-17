const express = require('express');
const app = express();
const port = 3000;
const cors = require ('cors')
const usersRouter = require('./routes/user_route');
const billsRouter = require('./routes/bills_route');
const authentificationRouter = require('./routes/authentification_route');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (err) => { console.log('error connecting to MongoDb', err); });
db.once('open', () => { console.log('Connected to MongoDb'); });

app.use(cors());
app.use(express.json())
app.use('/user', usersRouter);
app.use('/bills', billsRouter);
app.use('/auth', authentificationRouter);


app.listen(port, () =>{
console.log(`Server is running on port ${port}`);
})
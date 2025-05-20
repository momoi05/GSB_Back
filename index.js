const express = require('express');
const app = express();
const port = 3000;
const cors = require ('cors')
const usersRouter = require('./routes/user_route');
const billsRouter = require('./routes/bills_route');
const authentificationRouter = require('./routes/authentification_route');
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://admin:admin@cluster0.jn13m.mongodb.net/nexa')
const db = mongoose.connection;
db.on('error', (err) => {console.log('error connecting to MongoDb', err)})
db.on('open', () => {console.log('Connecting to MongoDb')})

app.use(express.json())
app.use(cors())
app.use('/user', usersRouter);
app.use('/bills', billsRouter);
app.use('/auth', authentificationRouter);

app.listen(port, () =>{
console.log(`Server is running on port ${port}`);
})
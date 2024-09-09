const express = require('express')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())

const colors = require('colors');
const dotenv = require('dotenv');
dotenv.config();
const createUser = require('./utils/auth/create.user');
createUser().catch(console.error);

const PORT = process.env.PORT || 3005

app.use(express.static('./public'))

app.use('/auth', require('./router/auth/auth.router'))
app.use('/requisite', require('./router/auth/requisite.router'))
app.use('/spravichnik', require('./router/storage/goal.router'))
app.use('/spravichnik', require('./router/storage/partner.router'))
app.use('/expense', require('./router/bank/expence.router'))
app.use('/revenue', require('./router/bank/revenue.router'))
app.use('/bank', require('./router/bank/bank.result.router'))
app.use('/bank/restr', require('./router/bank/restr.router'))

app.use(require('./middleware/errorHandler'));

app.listen(PORT, () => {
    console.log(`server runing on port : ${PORT}`.blue)
})
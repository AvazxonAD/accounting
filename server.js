const express = require('express')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())

require('colors')
require('dotenv').config()
require('./utils/auth/create.user')()

const PORT = process.env.PORT || 3005


app.use('/auth', require('./router/auth.router'))
app.use('/storage/bank', require('./router/storage/bank.storage.router'))
app.use('/storage/shot/number', require('./router/storage/shot.storage.router'))
app.use('/storage/account/number', require('./router/storage/account.number.storage.router'))
app.use('/storage/counterparties', require('./router/storage/counterparty.storage.router'))
app.use('/contract', require('./router/contract.router'))

app.use(require('./middleware/errorHandler'))


app.listen(PORT, () => {
    console.log(`server runing on port : ${PORT}`.blue)
})
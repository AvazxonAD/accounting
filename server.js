const express = require('express')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())

require('colors')
require('dotenv').config()
require('./utils/auth/create.user')()

const PORT = process.env.PORT || 3005


app.use('/auth', require('./router/auth/auth.router'))
app.use('/requisite', require('./router/auth/requisite.router'))
app.use('/spravichnik', require('./router/storage/goal.router'))
app.use('/spravichnik', require('./router/storage/partner.router'))
app.use('/expense', require('./router/bank/expence.router'))
app.use('/revenue', require('./router/bank/revenue.router'))
app.use('/bank', require('./router/bank/bank.result.router'))

app.use(require('./middleware/errorHandler'))


app.listen(PORT, () => {
    console.log(`server runing on port : ${PORT}`.blue)
})
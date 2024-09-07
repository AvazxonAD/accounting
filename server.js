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
app.use('/requisite', require('./router/requisite.router'))
app.use('/spravichnik', require('./router/spravichnik.router'))
app.use('/expense', require('./router/expence.router'))
app.use('/revenue', require('./router/revenue.router'))

app.use(require('./middleware/errorHandler'))


app.listen(PORT, () => {
    console.log(`server runing on port : ${PORT}`.blue)
})
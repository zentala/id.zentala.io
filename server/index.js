const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 2100;

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  console.log('Request ' + req.method.toUpperCase() + ' ' + req.url)
  next()
})

app.use('/', express.static('front/dist/'))

app.listen(port, () => console.log(`Server is listening at port ${port}!`))


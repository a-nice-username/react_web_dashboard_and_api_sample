import * as dotenv from 'dotenv'

dotenv.config()

import * as express from 'express'
import * as formidable from 'express-formidable'
import * as cors from 'cors'
import * as path from 'path'

import db from './query-functions'

const app = express()
const port = process.env.PORT || 4000

const dir = path.join(__dirname, '../public')

app.use(cors())
app.use(formidable())

app.use('/public', express.static(dir))

app.get('/', db.root)
app.post('/login', db.login)
app.post('/register', db.register)
app.get('/get-pictures', db.getPictures)
app.post('/add-a-picture', db.addAPicture)

app.listen(port, () => console.log(`App running on port ${port}.`))
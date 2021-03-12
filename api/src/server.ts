import * as dotenv from 'dotenv'

dotenv.config()

import * as express from 'express'
import * as formidable from 'express-formidable'
import * as cors from 'cors'
import * as path from 'path'

import db from './query-functions'

const app = express()
const port = process.env.PORT

const dir = path.join(__dirname, '../public')

app.use(cors())
app.use(formidable())

app.use('/public', express.static(dir))

app.get('/', db.root)
app.post('/register', db.register)

app.get('/frontend/check-if-account-exist', db.frontend.checkIfAccountExist)
app.post('/frontend/login', db.frontend.login)
app.get('/frontend/get-pictures', db.frontend.getPictures)
app.post('/frontend/add-a-picture', db.frontend.addAPicture)

app.get('/dashboard/check-account-role', db.dashboard.checkAccountRole)
app.post('/dashboard/change-accounts-role', db.dashboard.changeAccountsRole)
app.post('/dashboard/login', db.dashboard.login)
app.get('/dashboard/get-users', db.dashboard.getUsers)
app.get('/dashboard/get-administrators', db.dashboard.getAdministrators)
app.get('/dashboard/get-all-pictures', db.dashboard.getAllPictures)
app.post('/dashboard/delete-accounts', db.dashboard.deleteAccounts)
app.post('/dashboard/delete-pictures', db.dashboard.deletePictures)

app.listen(port, () => console.log(`App running on port ${port}.`))
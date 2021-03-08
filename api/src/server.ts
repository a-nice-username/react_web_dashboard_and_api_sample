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
app.post('/change-accounts-role', db.changeAccountsRole)
app.post('/delete-accounts', db.deleteAccounts)
app.get('/check-if-account-exist', db.checkIfAccountExist)
app.get('/check-account-role', db.checkAccountRole)

app.post('/frontend/login', db.frontend.login)
app.post('/frontend/register', db.frontend.register)
app.get('/frontend/get-pictures', db.frontend.getPictures)
app.post('/frontend/add-a-picture', db.frontend.addAPicture)

app.post('/dashboard/login', db.dashboard.login)
app.get('/dashboard/get-users', db.dashboard.getUsers)
app.get('/dashboard/get-administrators', db.dashboard.getAdministrators)

app.listen(port, () => console.log(`App running on port ${port}.`))
import { Request, Response } from 'express'

import { Pool } from 'pg'

import giveResponse from './helpers/give-response'

import * as fs from 'fs-extra'
import * as path from 'path'

const { env } = process

const pool = new Pool({
  user: env['DB_USER'],
  host: env['DB_HOST'],
  database: env['DB_NAME'],
  password: env['DB_PASSWORD'],
  port: Number(env['DB_PORT'])
})

const root = (req: Request, res: Response) => {
  let data = {}

  giveResponse(res,'success', data, 'You are currently running @crocodic/api')
}

const login = (req: Request, res: Response) => {
  let data = {}

  const { username, password } = req.fields

  if (!username) {
    giveResponse(res, 'bad_request', data, "Parameter 'username' required")

    return
  }

  if (!password) {
    giveResponse(res, 'bad_request', data, "Parameter 'password' required")

    return
  }

  pool.query(
    `SELECT * FROM accounts WHERE username = $1`,
    [username],
    (err, results) => {
      if(err) {
        giveResponse(res, 'bad_request', data, `${err.name} : ${err.message}`)

        return
      }

      if(results.rows.length > 0) {
        if(password == results.rows[0].password) {
          data = {
            ...results.rows[0],
            password: undefined
          }

          giveResponse(res, 'success', data, 'Sukses login')
        } else {
          giveResponse(res, 'bad_request', data, 'Password salah')
        }
      } else {
        giveResponse(res, 'not_found', data, `User dengan username '${username}' tidak ditemukan`)
      }
    }
  )
}

const register = (req: Request, res: Response) => {
  let data = {}

  const { username, password } = req.fields

  if (!username) {
    giveResponse(res, 'bad_request', data, "Parameter 'username' required")

    return
  }

  if (!/^[a-zA-Z0-9-_]+$/.test(username as string)) {
    giveResponse(res, 'bad_request', data, 'Mohon untuk input username hanya dengan alpha numerik dan underscore saja')

    return
  }

  if (!password) {
    giveResponse(res, 'bad_request', data, "Parameter 'password' required")

    return
  }

  pool.query(
    `SELECT * FROM accounts WHERE username = $1`,
    [username],
    (err, results) => {
      if(err) {
        giveResponse(res, 'bad_request', data, `${err.name} : ${err.message}`)

        return
      }  
      
      if(results.rows.length > 0) {
        giveResponse(res, 'bad_request', data, `Maaf username '${username}' sudah dipakai, mohon gunakan username yang lain`)
      } else {
        pool.query(
          `INSERT INTO accounts (username, password, role) VALUES ($1, $2, 'user')`,
          [username, password],
          (err, results) => {
            if(err) {
              giveResponse(res, 'bad_request', data, `${err.name} : ${err.message}`)
      
              return
            }

            giveResponse(res, 'success', data, `Sukses register dengan username '${username}'`)
          }
        )
      }
    }
  )
}

const getPictures = (req: Request, res: Response) => {
  let data = [] as any[]

  const { id } = req.query

  if (!id) {
    giveResponse(res, 'bad_request', data, "Parameter 'id' required")

    return
  }

  pool.query(
    `SELECT * FROM accounts WHERE id = $1`,
    [id],
    (err, results) => {
      if(err) {
        giveResponse(res, 'bad_request', data, err.toString())

        return
      }

      if(results.rows.length == 0) {
        giveResponse(res, 'not_found', data, 'Tidak ditemukan user dengan id yang diberikan')

        return
      }

      pool.query(
        `SELECT * FROM pictures WHERE owner_id = $1 ORDER BY created_at DESC`,
        [id],
        (err, results) => {
          if(err) {
            giveResponse(res, 'bad_request', data, err.toString())

            return
          }

          data = results.rows.map(row => ({
            ...row,
            url: req.protocol + '://' + req.get('host') + row.url
          }))

          giveResponse(res,  'success', data, 'Sukses mendapatkan gambar')
        }
      )
    }
  )
}

const addAPicture = (req: Request, res: Response) => {
  let data = [] as any[]

  const { owner_id, title } = req.fields

  if (!owner_id) {
    giveResponse(res, 'bad_request', data, "Parameter 'owner_id' required")

    return
  }

  if (!title) {
    giveResponse(res, 'bad_request', data, "Parameter 'title' required")

    return
  }

  if (!req.files.picture || !(req.files.picture as any)?.type) {
    giveResponse(res, 'bad_request', data, "Parameter 'picture' required")

    return
  }
  
  const newFileName = (new Date()).getTime() + '_' + (req.files.picture as any)?.name.trim().replace(/ /g, '-')
  const newFilePath = path.join(__dirname, '../') + 'public/images/' + newFileName

  pool.query(
    `SELECT * FROM accounts WHERE id = $1`,
    [owner_id],
    (err, results) => {
      if(err) {
        giveResponse(res, 'bad_request', data, err.toString())

        return
      }

      if(results.rows.length == 0) {
        giveResponse(res, 'not_found', data, 'Tidak ditemukan user dengan owner_id yang diberikan')

        return
      }

      if(!fs.existsSync(newFilePath)) {
        fs.move(
          (req.files.picture as any)?.path,
          newFilePath,
          { overwrite: false },
          (err: any) => {
            if (err) {
              giveResponse(res, 'bad_request', data, 'Gagal memindah file upload')
      
              return console.error(err)
            }
    
            pool.query(
              `INSERT INTO pictures (owner_id, filename, title, url) VALUES ($1, $2, $3, $4)`,
              [owner_id, newFileName, title, '/public/images/' + newFileName],
              (err, results) => {
                if(err) {
                  giveResponse(res, 'bad_request', data, err.toString())
    
                  return
                }
    
                pool.query(
                  `SELECT * FROM pictures WHERE owner_id = $1 ORDER BY created_at DESC`,
                  [owner_id],
                  (err, results) => {
                    if(err) {
                      giveResponse(res, 'bad_request', data, err.toString())
        
                      return
                    }

                    data = results.rows.map(row => ({
                      ...row,
                      url: req.protocol + '://' + req.get('host') + row.url
                    }))
    
                    giveResponse(res, 'success', data, 'Sukses upload gambar')
                  }
                )
              }
            )
          }
        )
      } else {
        giveResponse(res, 'bad_request', data, 'Tidak dapat menyalin file dengan nama duplikat')
      }
    }
  )
}

const dashboardLogin = (req: Request, res: Response) => {
  let data = {}

  const { username, password } = req.fields

  if (!username) {
    giveResponse(res, 'bad_request', data, "Parameter 'username' required")

    return
  }

  if (!password) {
    giveResponse(res, 'bad_request', data, "Parameter 'password' required")

    return
  }

  pool.query(
    `SELECT * FROM accounts WHERE username = $1 AND NOT role = 'user'`,
    [username],
    (err, results) => {
      if(err) {
        giveResponse(res, 'bad_request', data, `${err.name} : ${err.message}`)

        return
      }

      if(results.rows.length > 0) {
        if(password == results.rows[0].password) {
          data = {
            ...results.rows[0],
            password: undefined
          }

          giveResponse(res, 'success', data, 'Sukses login')
        } else {
          giveResponse(res, 'bad_request', data, 'Password salah')
        }
      } else {
        giveResponse(res, 'not_found', data, `User dengan username '${username}' tidak ditemukan`)
      }
    }
  )
}

const dashboardGetUsers = (req: Request, res: Response) => {
  let data = [] as any[]

  pool.query(
    `SELECT * FROM accounts WHERE role = 'user'`,
    [],
    (err, results) => {
      if(err) {
        giveResponse(res, 'bad_request', data, err.toString())

        return
      }

      if(results.rows.length == 0) {
        giveResponse(res, 'not_found', data, 'Tidak ditemukan daftar user')

        return
      }

      data = results.rows.map(row => ({
        ...row,
        password: undefined
      }))

      giveResponse(res, 'success', data, 'Sukses mendapatkan daftar user')
    }
  )
}

const dashboardGetAdministrators = (req: Request, res: Response) => {
  let data = [] as any[]

  pool.query(
    `SELECT * FROM accounts WHERE NOT role = 'user'`,
    [],
    (err, results) => {
      if(err) {
        giveResponse(res, 'bad_request', data, err.toString())

        return
      }

      if(results.rows.length == 0) {
        giveResponse(res, 'not_found', data, 'Tidak ditemukan daftar administrator')

        return
      }

      data = results.rows.map(row => ({
        ...row,
        password: undefined
      }))

      giveResponse(res, 'success', data, 'Sukses mendapatkan daftar administrator')
    }
  )
}

const dashboardChangeAccountsRole = (req: Request, res: Response) => {
  let data = {}

  const { IDs, role } = req.fields

  if (!IDs) {
    giveResponse(res, 'bad_request', data, "Parameter 'IDs' required")

    return
  }

  if (!role) {
    giveResponse(res, 'bad_request', data, "Parameter 'role' required")

    return
  }

  pool.query(
    `UPDATE accounts SET role = $1 WHERE id IN (${IDs})`,
    [role],
    (err, results) => {
      if(err) {
        giveResponse(res, 'bad_request', data, err.toString())

        return
      }

      giveResponse(res, 'success', data, `Sukses mengubah role akun - akun menjadi ${role}`)
    }
  )
}

const dashboardDeleteAccounts = (req: Request, res: Response) => {
  let data = {}

  const { IDs } = req.fields

  if (!IDs) {
    giveResponse(res, 'bad_request', data, "Parameter 'IDs' required")

    return
  }

  pool.query(
    `SELECT * FROM pictures WHERE owner_id IN (${IDs})`,
    [],
    (err, results) => {
      if(err) {
        giveResponse(res, 'bad_request', data, err.toString())

        return
      }

      const picturesURL = results.rows.map(row => row.url)

      pool.query(
        `DELETE FROM pictures WHERE owner_id IN (${IDs})`,
        [],
        (err, results) => {
          if(err) {
            giveResponse(res, 'bad_request', data, err.toString())
    
            return
          }
    
          pool.query(
            `DELETE FROM accounts WHERE id IN (${IDs})`,
            [],
            (err, results) => {
              if(err) {
                giveResponse(res, 'bad_request', data, err.toString())
        
                return
              }
        
              giveResponse(res, 'success', data, 'Sukses menghapus akun - akun')
            }
          )
        }
      )

      for(const pictureURL of picturesURL) {
        fs.unlink(`.${pictureURL}`)
      }
    }
  )
}

export default {
  root,
  frontend: {
    login,
    register,
    getPictures,
    addAPicture
  },
  dashboard: {
    login: dashboardLogin,
    getUsers: dashboardGetUsers,
    getAdministrators: dashboardGetAdministrators,
    changeAccountsRole: dashboardChangeAccountsRole,
    deleteAccounts: dashboardDeleteAccounts
  }
}
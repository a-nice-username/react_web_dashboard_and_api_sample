const BASE_URL = process.env['REACT_APP_API_BASE_URL']

type CustomResponseType = {
  JSON?: any,
  Text?: string,
  error?: any
}

export const CustomFetch = async(
  method: 'GET' | 'POST',
  endpoint: string,
  isContainFile: boolean,
  params?: any,
) => {
  const response = {} as CustomResponseType

  let url = `${BASE_URL}${endpoint}`
  let body: FormData | string | undefined

  if(params != undefined) {
    if(method == 'GET') {
      let queries = [] as string[]

      for(const key in params) {
        if(params.hasOwnProperty(key)) {
          queries.push(`${key}=${params[key]}`)
        }
      }

      if(queries.length > 0) {
        for(const queryIndex in queries) {
          url += `${Number(queryIndex) == 0 ? '?' : '&'}${queries[queryIndex]}`
        }
      }
    } else if(method == 'POST') {
      if(isContainFile) {
        body = new FormData()

        for(const key in params) {
          if(params.hasOwnProperty(key)) {
            body.append(key, params[key])
          }
        }
      } else {
        body = JSON.stringify(params)
      }
    }
  }

  let headers: any

  if(method == 'POST') {
    headers = {
      'Accept': 'application/json'
    }
    
    if(!isContainFile) {
      headers['Content-Type'] = 'application/json'
    }
  }

  await fetch(
    url,
    {
      method,
      headers,
      body
    }
  )
  .then(res => res.text())
  .then(resText => {
    response.Text = resText

    if (resText[0] == `{`) {
      response.JSON = JSON.parse(resText)
    }
  })
  .catch(error => response.error = error)

  return response
}

type CheckIfAccountExistParamsType = {
  ID: number
}

type LoginParamsType = {
  username: string,
  password: string
}

type RegisterParamsType = {
  username: string,
  password: string
}

type GetPicturesParamsType = {
  id: number
}

type AddAPictureParamsType = {
  owner_id: number,
  title: string,
  picture: File
}

export const API = {
  CheckIfAccountExist: (params: CheckIfAccountExistParamsType) => CustomFetch('GET', '/check-if-account-exist', false, params),
  Login: (params: LoginParamsType) => CustomFetch('POST', '/frontend/login', false, params),
  Register: (params: RegisterParamsType) => CustomFetch('POST', '/frontend/register', false, params),
  GetPictures: (params: GetPicturesParamsType) => CustomFetch('GET', '/frontend/get-pictures', false, params),
  AddAPicture: (params: AddAPictureParamsType) => CustomFetch('POST', '/frontend/add-a-picture', true, params)
}
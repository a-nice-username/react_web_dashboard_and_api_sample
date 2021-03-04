import { Location } from 'history'

function API(
  endpoint: '/login' |
    '/register' |
    '/add-a-picture' |
    '/get-pictures'
) {
  return `${process.env['REACT_APP_API_BASE_URL']}${endpoint}`
}

let location: Location | undefined

function getLocation() {
  return location
}

function setLocation(newLocation: Location | undefined) {
  location = newLocation
}

export {
  API,
  getLocation,
  setLocation
}
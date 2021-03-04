function API(
  endpoint: '/login' |
    '/register' |
    '/add-a-picture' |
    '/get-pictures'
) {
  return `${process.env['REACT_APP_API_BASE_URL']}${endpoint}`
}

let location: any

function getLocation() {
  return location
}

function setLocation(newLocation: any) {
  location = newLocation
}

export {
  API,
  getLocation,
  setLocation
}
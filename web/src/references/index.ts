import { Location } from 'history'

let location: Location | undefined

function getLocation() {
  return location
}

function setLocation(newLocation: Location | undefined) {
  location = newLocation
}

export {
  getLocation,
  setLocation
}
import { API } from './custom-fetch'

async function validateAccountRoleAccess(
  ID: number,
  nextPositiveAction: () => void,
  nextNegativeAction: () => void
) {
  const res = await API.CheckAccountRole({
    ID
  })
  
  if(res.JSON) {
    if(res.JSON['status'] == 'success') {
      const { role } = res.JSON['data']

      if(role == 'administrator' || role == 'superuser') {
        nextPositiveAction()
      } else {
        alert('Maaf anda akun anda telah berganti role')

        localStorage.removeItem('LOGIN_DATA')

        nextNegativeAction()
      }
    } else if(res.JSON['status'] == 'not_found') {
      alert('Maaf anda telah keluar dari akun / akun anda telah dihapus')

      localStorage.removeItem('LOGIN_DATA')

      nextNegativeAction()
    }
  } else {
    console.log(res.Text || res.error.toString())
  }
}

export {
  validateAccountRoleAccess
}
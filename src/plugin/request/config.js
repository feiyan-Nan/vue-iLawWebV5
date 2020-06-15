import db from '../db'
const ls = db.ls

const config = {
//   timeout: 10000,
  headers: {
    'Authorization': `Token ${ls.get('iFileToken')}`,
    'token': ls.get('token'),
    'deviceType': 'web'
  },
}

export default config

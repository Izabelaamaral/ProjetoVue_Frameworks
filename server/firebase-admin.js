import admin from 'firebase-admin'
import key from './key.json' with { type: 'json' }

admin.initializeApp({
  credential: admin.credential.cert(key),
})

export default admin
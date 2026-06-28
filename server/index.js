import express from 'express'
import cors from 'cors'
import admin from './firebase-admin.js'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/auth/verify', async (req, res) => {
  const { idToken } = req.body
  if (!idToken) return res.status(400).json({ error: 'Token não informado' })

  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    console.log('Usuário autenticado:', decoded.email)
    return res.json({ ok: true, uid: decoded.uid, email: decoded.email, name: decoded.name })
  } catch (err) {
    console.error('❌ Token inválido:', err.message)
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }
})

app.listen(3001, () => console.log('🚀 Backend rodando em http://localhost:3001'))
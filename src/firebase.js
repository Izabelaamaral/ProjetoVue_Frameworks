import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey:            "AIzaSyC1wmkm_Y80CGZUAPkunh4HdomG8Mo-JhM",
  authDomain:        "minha-app-vue.firebaseapp.com",
  projectId:         "minha-app-vue",
  storageBucket:     "minha-app-vue.firebasestorage.app",
  messagingSenderId: "278690942840",
  appId:             "1:278690942840:web:2cbbd8845029d89205028d",
}

const app = initializeApp(firebaseConfig)

export const auth          = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
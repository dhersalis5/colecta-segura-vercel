import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCwQyD0fEyXYWoQYI4kR0x1nBH7H3pJCoA",
  authDomain: "colecta-segura.firebaseapp.com",
  projectId: "colecta-segura",
  storageBucket: "colecta-segura.appspot.com",
  messagingSenderId: "895445982774",
  appId: "1:895445982774:web:4a6b54e04a5fe9a01e3bb1"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exportar instancia de autenticación
export const auth = getAuth(app);
export default app; 
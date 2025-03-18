import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCwQyD0fEyXYWoQYI4kR0x1nBH7H3pJCoA",
  authDomain: "colecta-segura.firebaseapp.com",
  projectId: "colecta-segura",
  storageBucket: "colecta-segura.appspot.com",
  messagingSenderId: "895445982774",
  appId: "1:895445982774:web:d7a5a7686eb65ff1f98297"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exportar instancia de autenticación
export const auth = getAuth(app);
export default app; 
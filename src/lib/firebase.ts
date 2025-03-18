import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC7z5iK86JX9f0jZ5xTj0Y_L66A8TdNRzY",
  authDomain: "colecta-segura.firebaseapp.com",
  projectId: "colecta-segura",
  storageBucket: "colecta-segura.appspot.com",
  messagingSenderId: "764292011841",
  appId: "1:764292011841:web:1e6a9f8d74d9e7a1e1e1e1"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exportar instancia de autenticación
export const auth = getAuth(app);
export default app; 
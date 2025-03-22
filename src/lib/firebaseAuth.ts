import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase';

export const firebaseAuth = {
  // Iniciar sesión
  login: async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let message = 'Error al iniciar sesión';
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Email inválido';
          break;
        case 'auth/user-disabled':
          message = 'Esta cuenta ha sido deshabilitada';
          break;
        case 'auth/user-not-found':
          message = 'No existe una cuenta con este email';
          break;
        case 'auth/wrong-password':
          message = 'Contraseña incorrecta';
          break;
        default:
          message = error.message;
      }
      return { success: false, message };
    }
  },

  // Cerrar sesión
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  },

  // Restablecer contraseña
  resetPassword: async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { 
        success: true, 
        message: 'Se ha enviado un correo para restablecer tu contraseña' 
      };
    } catch (error: any) {
      let message = 'Error al enviar el correo de restablecimiento';
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Email inválido';
          break;
        case 'auth/user-not-found':
          message = 'No existe una cuenta con este email';
          break;
        default:
          message = error.message;
      }
      return { success: false, message };
    }
  },

  // Obtener el usuario actual
  getCurrentUser: (): Promise<User | null> => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
}; 
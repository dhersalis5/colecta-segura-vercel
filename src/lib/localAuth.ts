interface User {
  email: string;
  password: string;
}

// Autenticación local basada en localStorage
export const localAuth = {
  // Comprobar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    return localStorage.getItem('auth_token') !== null;
  },

  // Iniciar sesión
  login: (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Usuario y contraseña admin predefinidos
    const adminUser = { email: 'admin@colectasegura.com.ar', password: 'admin123' };
    
    // Verificar si hay algún usuario registrado en localStorage
    const storedUsers = localStorage.getItem('admin_users');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [adminUser];
    
    // Verificar credenciales
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Crear un token simple (en una aplicación real, usaríamos JWT)
      const token = btoa(email + ':' + Date.now());
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', email);
      
      return Promise.resolve({ success: true });
    }
    
    return Promise.resolve({ 
      success: false, 
      message: 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.' 
    });
  },

  // Cerrar sesión
  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  // Obtener el usuario actual
  getCurrentUser: (): { email: string } | null => {
    const email = localStorage.getItem('auth_user');
    return email ? { email } : null;
  },

  // Registrar un nuevo usuario (solo para demo, normalmente restringido)
  register: (email: string, password: string, secretKey: string): Promise<{ success: boolean; message?: string }> => {
    // Clave secreta para registro (simple pero eficaz para demo)
    if (secretKey !== 'colecta-segura-2023') {
      return Promise.resolve({ 
        success: false, 
        message: 'La clave secreta es incorrecta' 
      });
    }
    
    // Verificar si ya existe un usuario con ese email
    const storedUsers = localStorage.getItem('admin_users');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    if (users.some(u => u.email === email)) {
      return Promise.resolve({ 
        success: false, 
        message: 'Ya existe un usuario con este email' 
      });
    }
    
    // Agregar nuevo usuario
    users.push({ email, password });
    localStorage.setItem('admin_users', JSON.stringify(users));
    
    // Iniciar sesión automáticamente
    const token = btoa(email + ':' + Date.now());
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', email);
    
    return Promise.resolve({ success: true });
  }
}; 
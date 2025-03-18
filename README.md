# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f32d9e29-3f21-4d28-a03b-173fee1dc035

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f32d9e29-3f21-4d28-a03b-173fee1dc035) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
dimenpm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f32d9e29-3f21-4d28-a03b-173fee1dc035) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Despliegue en Vercel

Este proyecto está configurado para ser desplegado fácilmente en Vercel, con funciones serverless para manejar los pagos de MercadoPago de forma segura.

### Pasos para desplegar en Vercel:

1. **Crear una cuenta en Vercel**
   - Registrate en [vercel.com](https://vercel.com) si aún no tienes una cuenta
   - Conecta tu cuenta de GitHub, GitLab o Bitbucket

2. **Importar el proyecto**
   - Desde el dashboard de Vercel, haz clic en "Import Project"
   - Selecciona el repositorio de este proyecto

3. **Configurar variables de entorno**
   - Durante el proceso de importación, configura las siguientes variables de entorno:
     - `MERCADOPAGO_ACCESS_TOKEN`: Tu token de acceso de MercadoPago
     - `CURRENCY_ID`: Código de moneda según tu país (por defecto ARS)

4. **Desplegar**
   - Haz clic en "Deploy" y espera a que Vercel construya e implemente tu proyecto
   - Una vez desplegado, Vercel te proporcionará una URL donde podrás acceder a tu aplicación

### Desarrollo local con emulación de funciones de Vercel

Para probar las funciones de Vercel localmente:

1. Instala el CLI de Vercel:
   ```bash
   npm i -g vercel
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   vercel dev
   ```

3. Esto ejecutará tanto la aplicación frontend como las funciones API en modo de desarrollo.

## Despliegue en Vercel con Credenciales Reales de MercadoPago

Para desplegar la aplicación en producción con credenciales reales de MercadoPago, sigue estos pasos detallados:

### 1. Obtener credenciales de producción de MercadoPago

1. Accede a tu cuenta de MercadoPago: [Panel de Desarrolladores](https://www.mercadopago.com.ar/developers/panel)
2. Ve a la sección "Credenciales" y elige "Checkout Pro" o "API"
3. En modo "Producción", copia el "Access Token" (no el Public Key)
   - Este token NO tiene el prefijo "TEST-" como el de pruebas
   - IMPORTANTE: Nunca compartas este token ni lo incluyas en código frontend

### 2. Preparar el proyecto para producción

1. Asegúrate de que tu repositorio esté actualizado y subido a GitHub:
   ```bash
   git add .
   git commit -m "Preparación para producción"
   git push
   ```

### 3. Configurar el proyecto en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no la tienes
2. Desde el dashboard, haz clic en "Import Project" o "New Project"
3. Conecta tu repositorio de GitHub/GitLab/Bitbucket
4. Durante la configuración, añade las siguientes variables de entorno:
   - `MERCADOPAGO_ACCESS_TOKEN`: Tu token de acceso REAL (sin el prefijo TEST-)
   - `CURRENCY_ID`: El código de moneda para tu país (ARS, MXN, CLP, etc.)

### 4. Verificar el despliegue

1. Vercel desplegará automáticamente tu aplicación y te proporcionará una URL
2. Verifica que la integración funciona correctamente:
   - Haz una donación de prueba con una tarjeta real
   - Confirma que se procesa correctamente
   - Verifica que recibes correctamente la notificación de pago

### 5. Configurar dominio personalizado (opcional)

1. En la configuración del proyecto en Vercel, ve a "Domains"
2. Añade tu dominio personalizado y sigue las instrucciones

### Notas importantes sobre seguridad en producción

- El token de acceso real NUNCA debe estar en el código fuente
- Siempre revisa los registros (logs) en Vercel para verificar el funcionamiento
- Configura alertas para estar al tanto de posibles errores
- Considera habilitar la autenticación de usuarios para mayor seguridad
- Realiza copias de seguridad periódicas de la base de datos

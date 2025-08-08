import { supabase } from './supabaseClient.js';

// LOGIN
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert('Error al iniciar sesión: ' + error.message);
    } else {
      alert('¡Bienvenido ' + email + '!');
      window.location.href = 'index.html';
    }
  });
}

// REGISTRO
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!email || !password) {
      alert("Por favor completá todos los campos.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert('Error al registrarse: ' + error.message);
    } else {
      const userId = data.user?.id;

      // Insertar en la tabla usuarios
      if (userId) {
        await supabase
          .from('usuarios')
          .insert([{ id: userId, email }]);
      }

      alert('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
      window.location.href = 'login.html';
    }
  });
}


import { supabase } from './supabaseClient.js';

async function cargarCarrito() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    alert('Debés iniciar sesión');
    window.location.href = '/login.html';
    return;
  }

  const carritoItems = document.getElementById('carrito-items');
  const carritoTotal = document.getElementById('carrito-total');

  // 🔄 Renderizar carrito desde Supabase
  async function renderCarrito() {
    const { data: carritoDb, error } = await supabase
      .from('carrito')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error al cargar el carrito:', error);
      return;
    }

    carritoItems.innerHTML = '';
    let total = 0;

    carritoDb.forEach(producto => {
      const item = document.createElement('div');
      item.className = 'item-carrito';
      item.innerHTML = `
        <strong>${producto.nombre || 'Producto'}</strong> - $${producto.precio || 0} - Talle: ${producto.talle}
        <button data-id="${producto.id}" class="eliminar-btn">❌</button>
      `;
      carritoItems.appendChild(item);
      total += producto.precio || 0;
    });

    carritoTotal.textContent = `Total estimado: $${total}`;

    // 🗑️ Eliminar producto del carrito
    document.querySelectorAll('.eliminar-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const { error } = await supabase
          .from('carrito')
          .delete()
          .eq('id', id);

        if (error) {
          alert('Error al eliminar el producto');
          console.error(error);
        } else {
          renderCarrito(); // Volver a renderizar
        }
      });
    });
  }

  await renderCarrito();

  // 🛂 Verificar si es admin y mostrar órdenes confirmadas
  const { data: roles } = await supabase
    .from('usuarios_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roles?.role === 'admin') {
    document.getElementById('compras-confirmadas').style.display = 'block';

    const { data: ordenes } = await supabase.from('ordenes').select('*');
    const lista = document.getElementById('lista-compras');
    lista.innerHTML = '';

    ordenes.forEach(o => {
      const item = document.createElement('div');
      item.className = 'compra-admin';
      const tal = o.talle || 'Sin talle';
      const dir = o.direccion || 'Sin dirección';
      const cp = o.codigo_postal || 'Sin CP';
      const nombre = o.nombre || 'Sin nombre';
      item.textContent = `Nombre: ${nombre} - Talle: ${tal} - Dirección: ${dir} - CP: ${cp}`;
      lista.appendChild(item);
    });
  }

  // ✅ Confirmar compra
  const btn = document.getElementById('confirmar-compra');
  if (btn && roles?.role !== 'admin') {
    btn.addEventListener('click', async () => {
      const direccion = document.getElementById('direccion').value.trim();
      const codigo_postal = document.getElementById('codigo_postal').value.trim();

      if (!direccion || !codigo_postal) {
        alert('Completá los datos de envío');
        return;
      }

      const { data: carritoDb } = await supabase
        .from('carrito')
        .select('*')
        .eq('user_id', user.id)
         .order('fecha', { ascending: false });

      for (const producto of carritoDb) {
        const { error } = await supabase.from('ordenes').insert({
          user_id: user.id,
          talle: producto.talle,
          direccion,
          codigo_postal,
          nombre: producto.nombre || 'Producto sin nombre'
        });

        if (error) {
          alert('Error al guardar la orden');
          console.error(error);
          return;
        }
      }

      // 🧹 Limpiar carrito después de confirmar
      await supabase
        .from('carrito')
        .delete()
        .eq('user_id', user.id);

      carritoItems.innerHTML = '';
      carritoTotal.textContent = '';
      document.getElementById('mensaje-confirmacion').style.display = 'block';
    });
  }
}

cargarCarrito();

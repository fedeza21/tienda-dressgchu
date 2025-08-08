const contenedor = document.getElementById('contenedor-pedidos');

async function cargarPedidos() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    alert('Tenés que iniciar sesión');
    window.location.href = '/login.html';
    return;
  }

  const { data: pedidos, error } = await supabase
    .from('ordenes')
    .select('id, direccion, estado, orden_items(nombre_producto, precio_producto)')
    .eq('user_id', user.id)
    .order('id', { ascending: false });

  if (error) {
    console.error('Error al cargar pedidos:', error);
    return;
  }

  contenedor.innerHTML = '';

  pedidos.forEach(pedido => {
    const itemsHTML = pedido.orden_items.map(p =>
      `<li>${p.nombre_producto} - $${p.precio_producto}</li>`
    ).join('');

    contenedor.innerHTML += `
      <div class="pedido">
        <h3>Pedido #${pedido.id}</h3>
        <p>Dirección: ${pedido.direccion}</p>
        <p>Estado: ${pedido.estado}</p>
        <ul>${itemsHTML}</ul>
      </div>
    `;
  });
}

cargarPedidos();

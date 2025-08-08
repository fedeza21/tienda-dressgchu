async function cargarPedidosAdmin() {
  const contenedor = document.getElementById('admin-pedidos-container');

  // Supongamos que tenés una función llamada obtenerPedidosAdmin()
  // que retorna { data, error }
  const { data: pedidos, error } = await obtenerPedidosAdmin();

  if (error) {
    contenedor.innerHTML = '<p>Error al cargar pedidos admin 😕</p>';
    console.error(error.message);
    return;
  }

  if (!pedidos || pedidos.length === 0) {
    contenedor.innerHTML = '<p>No hay pedidos disponibles.</p>';
    return;
  }

  contenedor.innerHTML = pedidos.map(pedido => {
    const productos = pedido.orden_items?.map(p =>
      `<li>${p.producto?.nombre || 'Producto desconocido'} - $${p.producto?.precio || 0}</li>`
    ).join('') || '<li>Sin productos</li>';

    return `
      <div class="pedido-admin">
        <h3>Pedido #${pedido.id}</h3>
        <p>Fecha: ${new Date(pedido.fecha).toLocaleDateString('es-AR')}</p>
        <p>Usuario: ${pedido.user_id}</p>
        <p>Estado: ${pedido.estado}</p>
        <p>Dirección: ${pedido.direccion}, CP: ${pedido.codigo_postal}</p>
        <p>Talle: ${pedido.talle}</p>
        <ul>${productos}</ul>
      </div>
    `;
  }).join('');
}

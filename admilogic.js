export const getAllOrders = async () => {
  // Simulación de pedidos para la vista inicial
  return [
    {
      user: 'fede123',
      date: '2025-07-25',
      items: ['Mouse', 'Teclado'],
      total: 8200
    },
    {
      user: 'ana456',
      date: '2025-07-24',
      items: ['Notebook'],
      total: 120000
    }
  ];
};
export const getPedidosByUser = async (username) => {
  const all = await getAllOrders();
  return all.filter(p => p.user === username);
};

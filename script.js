
const carrusel = document.querySelector('.imagenes');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const paso = 260;

if (carrusel && prev && next) {
  next.addEventListener('click', () => {
    const maxScroll = carrusel.scrollWidth - carrusel.clientWidth;
    carrusel.scrollLeft = carrusel.scrollLeft >= maxScroll - paso ? 0 : carrusel.scrollLeft + paso;
  });

  prev.addEventListener('click', () => {
    carrusel.scrollLeft = carrusel.scrollLeft <= 0 ? carrusel.scrollWidth : carrusel.scrollLeft - paso;
  });
}


function actualizarBadge() {
  const carrito = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.getElementById("cart-count") || document.getElementById("badge");
  if (badge) badge.innerText = carrito.length;
}
actualizarBadge();


const productos = [
  { nombre: "Remera Nike", precio: "$5000" },
  { nombre: "Zapatilla Adidas", precio: "$12000" },
];
const contenedor = document.getElementById("productos-container");
if (contenedor) {
  productos.forEach((p) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `<h3>${p.nombre}</h3><p>${p.precio}</p>`;
    contenedor.appendChild(div);
  });
}


function mostrarToast(mensaje = "Agregado al carrito ✅") {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = mensaje;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }
}


function agregarAlCarrito(nombre, precio) {
  const carrito = JSON.parse(localStorage.getItem("cart")) || [];
  carrito.push({ nombre, precio });
  localStorage.setItem("cart", JSON.stringify(carrito));
  actualizarBadge();
  mostrarToast(`${nombre} agregado al carrito por ${precio}`);
}


const userArea = document.getElementById('user-area');

async function renderUserArea() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    userArea.innerHTML = `
      <div class="user-dropdown">
        <button class="user-trigger">
          ${user.email} <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div class="dropdown-menu">
          <a href="cart.html">Ver carrito</a>
          <button class="logout-btn">Salir</button>
        </div>
      </div>
    `;
  } else {
    userArea.innerHTML = `
      <div class="user-dropdown">
        <a href="login.html" class="login-button">
          <i class="fa-regular fa-user"></i> Iniciar sesión
        </a>
      </div>
    `;
  }
}

renderUserArea(); 

document.addEventListener('click', async (e) => {
  const trigger = e.target.closest('.user-trigger');
  const menu = document.querySelector('.dropdown-menu');

  if (trigger && menu) {
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  } else if (menu && !e.target.closest('.dropdown-menu')) {
    menu.style.display = 'none';
  }

 const logoutBtn = e.target.closest('.logout-btn');
if (logoutBtn) {
  await supabase.auth.signOut();
  mostrarToast("Sesión cerrada 👋");
  setTimeout(() => {
    renderUserArea(); 
  }, 400); 
}

  }
);

async function finalizarCompra() {
  const carrito = JSON.parse(localStorage.getItem("cart")) || [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || carrito.length === 0) return mostrarToast("Sin sesión o carrito vacío 🚫");

  
  const { data: orden, error: ordenError } = await supabase
    .from("ordenes")
    .insert([{ user_id: user.id }])
    .select();

  if (ordenError) return mostrarToast("Error al crear orden 🛑");

  const ordenId = orden[0].id;

  
  const items = carrito.map(item => ({
    nombre_producto: item.nombre,
    precio_producto: item.precio,
    orden_id: ordenId
  }));

  const { error: itemsError } = await supabase.from("orden_items").insert(items);
  if (itemsError) return mostrarToast("Error al guardar productos");

  localStorage.removeItem("cart");
  actualizarBadge();
  mostrarToast("Compra registrada 🎉");

}

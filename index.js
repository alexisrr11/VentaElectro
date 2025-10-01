let productosGlobal = [];

async function cargarProductos() {
    try {
        const res = await fetch("./productos.json");
        const productos = await res.json();
        productosGlobal = productos.map((p, i) => ({ ...p, id: i + 1 }));
        aplicarFiltros(); // Render inicial
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

function inicializarWishlist() {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    document.querySelectorAll(".wishlist-btn").forEach(btn => {
        const id = btn.dataset.id;

        if (wishlist.includes(id)) btn.classList.add("text-red-500");

        btn.addEventListener("click", () => {
            btn.classList.toggle("text-red-500");

            if (wishlist.includes(id)) {
                wishlist = wishlist.filter(pid => pid !== id);
            } else {
                wishlist.push(id);
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            console.log("Wishlist actualizado:", wishlist);
        });
    });
}

function aplicarFiltros() {
    const categoria = document.getElementById("categoryFilter").value;
    const orden = document.getElementById("sortSelect").value;
    const search = document.getElementById("searchInput").value.toLowerCase();

    let filtrados = [...productosGlobal];

    // 🔹 Filtrar por categoría
    if (categoria !== "all") {
        filtrados = filtrados.filter(p => p.categoria === categoria);
    }

    // 🔹 Filtrar por búsqueda
    if (search) {
        filtrados = filtrados.filter(p =>
            p.titulo.toLowerCase().includes(search) ||
            p.descripcion.toLowerCase().includes(search) ||
            p.categoria.toLowerCase().includes(search)
        );
    }

    // 🔹 Ordenar
    if (orden === "price_asc") {
        filtrados.sort((a, b) => Number(a.precio) - Number(b.precio));
    } else if (orden === "price_desc") {
        filtrados.sort((a, b) => Number(b.precio) - Number(a.precio));
    } else if (orden === "new") {
        filtrados.sort((a, b) => b.id - a.id);
    }

    renderizarProductos(filtrados);
    // Autocompletar el input del producto al hacer click en Contactar
    document.querySelectorAll(".openContactModal").forEach(btn => {
        btn.addEventListener("click", () => {
            const producto = btn.dataset.producto;
            const inputProducto = document.querySelector("input[name='producto']");
            if (inputProducto) {
                inputProducto.value = producto;
                inputProducto.focus(); // opcional
            }
        });
    });
}

function renderizarProductos(productos) {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = `<p class="text-gray-500">No se encontraron productos</p>`;
        return;
    }

    const categorias = {};
    productos.forEach(prod => {
        if (!categorias[prod.categoria]) categorias[prod.categoria] = [];
        categorias[prod.categoria].push(prod);
    });

    for (const categoria in categorias) {
        const titulo = document.createElement("h3");
        titulo.className = "text-2xl bg-white text-center w-28 m-auto py-3 font-bold mt-8 mb-4 text-gray-800";
        titulo.textContent = categoria;
        contenedor.appendChild(titulo);

        const grid = document.createElement("div");
        grid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

        categorias[categoria].forEach(producto => {
            const card = document.createElement("article");
            card.className = "product-card bg-white rounded-2xl shadow p-4 flex flex-col bg-white/90";

            card.innerHTML = `
        <div class="relative rounded-lg overflow-hidden">
          <img src="${producto.imagen}" alt="${producto.titulo}" class="w-full object-contain rounded-lg">
          ${producto.etiqueta ? `<div class="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-semibold">${producto.etiqueta}</div>` : ""}
          ${producto.garantia ? `<div class="absolute top-3 right-3 bg-white/80 text-gray-800 px-2 py-1 rounded-md text-xs">${producto.garantia}</div>` : ""}
        </div>
        <div class="mt-4 flex-1">
          <h3 class="text-lg font-semibold">${producto.titulo}</h3>
          <p class="text-sm text-gray-500 mt-1">${producto.descripcion}</p>
          <div class="mt-3 flex items-center justify-between">
            <div>
              ${producto.precioAnterior ? `<div class="text-gray-500 line-through text-sm">$ ${producto.precioAnterior}</div>` : ""}
              <div class="text-amber-600 font-bold text-xl">$ ${producto.precio}</div>
            </div>
            <div class="text-sm text-green-600 font-medium">${producto.estado}</div>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
            <a href="#contacto" data-producto="${producto.titulo}" class="openContactModal font-bold flex-1 inline-flex items-center justify-center gap-2 border-2 border-amber-500 text-amber-600 px-3 py-2 rounded-lg hover:bg-amber-50">
                Contactar
            </a>
            <button class="wishlist-btn px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                <i class='bx bx-heart'></i>
            </button>
        </div>
      `;

            grid.appendChild(card);
        });

        contenedor.appendChild(grid);
    }

    inicializarWishlist();
}

// 🔹 Listeners
document.getElementById("categoryFilter").addEventListener("change", aplicarFiltros);
document.getElementById("sortSelect").addEventListener("change", aplicarFiltros);
document.getElementById("searchInput").addEventListener("input", aplicarFiltros);

// 🔹 Inicial
cargarProductos();



// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Modal behaviour
const contactModal = document.getElementById('contactModal');
const openBtns = document.querySelectorAll('.openContactModal');
openBtns.forEach(btn => btn.addEventListener('click', openModal));
function openModal() {
    contactModal.classList.remove('hidden');
    contactModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    contactModal.classList.add('hidden');
    contactModal.classList.remove('flex');
    document.body.style.overflow = '';
}
// Close when escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Contact form: abrir WhatsApp con mensaje (simula envío)
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim() || 'Hola, me interesa el producto.';
    // Prepara mensaje para WhatsApp
    const text = encodeURIComponent`(Hola, soy \${name}. \nTel: \${phone}\n\${message}\)`;
    const wa = 'https://wa.me/5491112345678?text=' + text;
    window.open(wa, '_blank');
    closeModal();
});

// Filtros (simple demo frontend)
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const productCards = Array.from(document.querySelectorAll('.product-card'));

function filterAndSort() {
    const cat = categoryFilter.value;
    const sort = sortSelect.value;

    // Filtrado: demo (usa atributos o clases para categorizar en implementación real)
    productCards.forEach((card, idx) => {
        // ejemplo simple: alternamos vistas por índice para demo
        if (cat === 'all') {
            card.classList.remove('hidden');
        } else {
            // demo: si nombre del producto contiene la categoría
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            if (title.includes(cat)) card.classList.remove('hidden');
            else card.classList.add('hidden');
        }
    });

    // Ordenamiento demo: no reordena DOM aquí, solo placeholder
    // Para reordenar, necesitarías reconstruir el grid o usar flexbox + order
}

categoryFilter?.addEventListener('change', filterAndSort);
sortSelect?.addEventListener('change', filterAndSort);

// Buscador básico
document.getElementById('searchBtn')?.addEventListener('click', () => {
    const q = document.getElementById('searchInput').value.toLowerCase();
    productCards.forEach(card => {
        const t = card.querySelector('h3')?.textContent.toLowerCase() || '';
        if (!q || t.includes(q)) card.classList.remove('hidden');
        else card.classList.add('hidden');
    });
});


//Whatsapp

document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que recargue la página

    const nombre = this.name.value.trim();
    const producto = this.producto.value.trim();

    if (!nombre || !producto) return; // Validación simple

    // Número de WhatsApp (formato internacional sin signos +)
    const telefono = "5491112345678";

    // Mensaje prellenado
    const mensaje = `Hola! Mi nombre es ${nombre} y estoy interesado/a en el producto: ${producto}`;

    // URL de WhatsApp
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    // Abrir WhatsApp en nueva pestaña
    window.open(url, "_blank");

    // Opcional: resetear formulario
    this.reset();
});

async function cargarDetalle() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const res = await fetch("./productos.json");
  const productos = await res.json();
  const productosConId = productos.map((p, i) => ({ ...p, id: i + 1 }));
  const producto = productosConId.find(p => p.id === id);

  const contenedor = document.getElementById("detalle-producto");
  if (!producto) {
    contenedor.innerHTML = "<p>Producto no encontrado</p>";
    return;
  }

  // Si no tiene varias imágenes, usamos la principal
  const imagenes = producto.imagenes || [producto.imagen];

  contenedor.innerHTML = `
    <div class="bg-white shadow-lg rounded-2xl overflow-hidden p-6">
      <div class="flex flex-col md:flex-row gap-6">
        
        <!-- Imagen principal -->
        <div class="flex-1 flex flex-col items-center">
          <img id="imagenPrincipal" src="${imagenes[0]}" 
               alt="${producto.titulo}" 
               class="w-auto max-h-[50vh] rounded-lg object-contain cursor-pointer shadow-lg">
          
          <!-- Miniaturas -->
          <div class="flex gap-3 mt-4">
            ${imagenes.map((img, i) => `
              <img src="${img}" 
                   data-index="${i}" 
                   class="miniatura w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-amber-500 transition-all">
            `).join('')}
          </div>
        </div>

        <!-- Detalles -->
        <div class="flex-1">
          <h2 class="text-3xl font-bold mb-2">${producto.titulo}</h2>
          <p class="text-gray-700 mb-4"><strong>Estado:</strong> ${producto.estado}</p>
          <p class="text-gray-600 mb-2">${producto.descripcion}</p>
          <div class="text-amber-600 font-bold text-2xl mb-6">$ ${producto.precio}</div>
          <a href="index.html" class="text-blue-600 hover:underline">← Volver</a>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div id="modalImagen" class="hidden fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <img id="modalImg" src="" alt="Imagen ampliada" class="max-w-[90%] max-h-[80vh] rounded-lg shadow-xl">
    </div>
  `;

  // --- Carrusel interactivo ---
  const imgPrincipal = document.getElementById("imagenPrincipal");
  const miniaturas = contenedor.querySelectorAll(".miniatura");
  const modal = document.getElementById("modalImagen");
  const modalImg = document.getElementById("modalImg");

  // Cambiar imagen principal al clickear miniatura
  miniaturas.forEach(mini => {
    mini.addEventListener("click", () => {
      const index = mini.dataset.index;
      imgPrincipal.src = imagenes[index];
      miniaturas.forEach(m => m.classList.remove("border-amber-500"));
      mini.classList.add("border-amber-500");
    });
  });

  // --- Modal ---
  imgPrincipal.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modalImg.src = imgPrincipal.src;
  });

  modal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") modal.classList.add("hidden");
  });

   const inputProducto = document.querySelector('input[name="producto"]');
  if (inputProducto) {
    inputProducto.value = producto.titulo;
  }
}

cargarDetalle();

//Whatsapp
function whatsappFormulario() {
    document.getElementById("form").addEventListener("submit", function (e) {
        e.preventDefault();
    
        const nombre = this.name.value.trim();
        const producto = this.producto.value.trim();
    
        if (!nombre || !producto) return;
    
        // Número de WhatsApp
        const telefono = "541132408158";
    
        // Mensaje prellenado
        const mensaje = `Hola! Mi nombre es ${nombre} y estoy interesado/a en el producto: ${producto}`;
    
        // URL de WhatsApp
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    
        window.open(url, "_blank");
        this.reset();
    });
}
whatsappFormulario();

//Menu
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden")
});
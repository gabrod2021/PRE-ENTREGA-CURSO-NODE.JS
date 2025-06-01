const args = process.argv;
const [, , method, path, arg1, arg2, arg3] = args;

const BASE_URL = 'https://fakestoreapi.com';
const url = `${BASE_URL}/${path}`;

const requestOptions = {
    method: method.toUpperCase(),// El método siempre en mayúsculas
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token', 
    },
  };

// --- Lógica Específica para POST ---
if (requestOptions.method === 'POST' && path === 'products') {
  const productData = {
    title: arg1,
    price: parseFloat(arg2),
    category: arg3,
    description: `Descripción de ${arg1}`,
    image: 'https://i.pravatar.cc/300',
  };
  try {
    requestOptions.body = JSON.stringify(productData);
  } catch (error) {
    console.error('Error al preparar los datos para la API:', error.message);
  }
}
// ---  Petición FETCH ---
if (path) {
  fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log(`\n--- Respuesta para ${requestOptions.method} ${path} ---`);

      if (requestOptions.method === 'GET') {
        if (path === 'products') {
          console.log('Lista Completa de Productos:');
          data.forEach(product => {
            const { id, title, price, category, description, image } = product;
            console.log(`\n--- Producto ID: ${id} ---`);
            console.log(`  Título: ${title}`);
            console.log(`  Precio: $${price}`);
            console.log(`  Categoría: ${category}`);
            console.log(`  Descripción: ${description.substring(0, 70)}...`);
            console.log(`  Imagen: ${image.substring(0, 50)}...`);
          });
        } else if (path.startsWith('products/')) {
          const parts = path.split('/');
          const productId = parseInt(parts[1]);

          console.log(`\n--- Detalles del Producto con ID: ${productId} ---`);
          if (data) {
            console.log(JSON.stringify(data, null, 2));
          } else {
            console.log(`Producto con ID ${productId} no encontrado.`);
          }
        }
      } else if (requestOptions.method === 'POST') {
        console.log('Producto insertado sin descripcion ni imagen):');
        const { id, arg1, price, category } = data;
        console.log(`  Nuevo ID: ${id}`);
        console.log(`  Título: ${title}`);
        console.log(`  Precio: $${price}`);
        console.log(`  Categoria: ${category}`);
      } else if (requestOptions.method === 'DELETE') {
        const productId = parseInt(path.split('/')[1]);
        console.log(`\n--- Eliminación simulada de Producto ID: ${productId} ---`);
        console.log('Se devuelve el objeto que fue "eliminado":');
        console.log(JSON.stringify(data, null, 2));
        console.log('Se simula la eliminacion.');
      } else {
        console.log('No se reconece el metodo:', data);
      }
      console.log('-----------------------------------');
    })
    .catch(e => {
      console.error('Error al consumir la API:', e.message);
    })
    .finally(() => {
      console.log('La consulta a la API ha finalizado.');
    });
} else {
  console.error('Error: Se esperaban al menos un método y una ruta para la API.');
}


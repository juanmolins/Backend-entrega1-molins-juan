import express from 'express';
const app = express();
const port = 3000;

// Arreglo de usuarios (simulado)
let products = [
  { id: 1, title: 'Producto1', description: 'Description1', code: 'code1', price: 'price1', status: 'true', stock: 100, category:'category1', thumbnail: 'urlimage1' },
  { id: 2, title: 'Producto2', description: 'Description2', code: 'code2', price: 'price2', status: 'true', stock: 100, category:'category2', thumbnail: 'urlimage2' },
  { id: 3, title: 'Producto3', description: 'Description3', code: 'code3', price: 'price3', status: 'true', stock: 100, category:'category3', thumbnail: 'urlimage3' },
];

// Middleware para analizar el cuerpo de las solicitudes como datos codificados en formularios
app.use(express.urlencoded({ extended: true }));
// Middleware para analizar el cuerpo de las solicitudes como datos JSON
app.use(express.json());

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});


// Obtener todos los productos (GET)
app.get('/api/products', (req, res) => {
  res.status(200).json(products);
});

// Obtener un producto por ID (GET)
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = products.find(product => product.id === id);
  if (!producto) {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  } else {
    res.status(200).json(producto);
  }
});

// Agregar nuevo producto (POST)
app.post('/api/products', (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.status || !req.body.stock || !req.body.category || !req.body.thumbnail) {
      res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    } else {
    
    // Encontrar el último ID existente
    const existingIds = products.map(product => product.id);
    // Generar un nuevo ID que no se encuentre en existingIds
    let newProductId = Math.max(...existingIds) + 1;

      const nuevoProducto = {
        id: newProductId,
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status,
        stock: req.body.stock,
        category: req.body.category,
        thumbnail: req.body.thumbnail
      };
      products.push(nuevoProducto);
      res.status(201).json(nuevoProducto);
    }
});
  

// Actualizar un producto por ID (PUT)
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = products.find(product => product.id === id);
  if (!producto) {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  } else {
    producto.title = req.body.title || producto.title;
    producto.description = req.body.description || producto.description;
    producto.code = req.body.code || producto.code;
    producto.price = req.body.price || producto.price;
    producto.status = req.body.status || producto.status;
    producto.stock = req.body.stock || producto.stock;
    producto.category = req.body.category || producto.category;
    producto.thumbnail = req.body.thumbnail || producto.thumbnail
    res.status(200).json(producto);
  }
});

// Eliminar un usuario por ID (DELETE)
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productoIndex = products.findIndex(product => product.id === id);
  if (productoIndex === -1) {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  } else {
    const productoEliminado = products.splice(productoIndex, 1)[0];
    res.status(200).json(productoEliminado);
  }
});

// Arreglo de usuarios (simulado)
const carts = [
    { id: 1, products: [] },
    { id: 2, products: [] },
];
  

// Crear carrito vacio (POST)
app.post('/api/carts', (req, res) => {
    // Verificar si se proporcionaron productos en la solicitud
   
    // Encontrar el último ID de carrito
    const lastCartId = carts.length > 0 ? carts[carts.length - 1].id : 0;  
    // Generar un nuevo ID sumando 1 al último ID
    const newCartId = lastCartId + 1;  
    // Crear un nuevo carrito con el ID y los productos proporcionados
    const newCart = {
      id: newCartId,
      products: []
    };
    // Agregar el nuevo carrito a la lista de carritos
    carts.push(newCart);
  
    res.status(201).json(newCart);
});

// Listar productos que pertenecen al carrito con determinado id (GET)
app.get('/api/carts/:cid', (req, res) => {
    const cid = parseInt(req.params.cid);
    const carrito = carts.find(cart => cart.id === cid);
    if (!carrito) {
      res.status(404).json({ mensaje: 'Carrito no encontrado' });
    } else {
      res.status(200).json(carrito);
    }
});

// Agregar productos al carrito deseado (POST)
app.post('/api/carts/:cid/products/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
  
    // Encontrar el carrito con el ID proporcionado
    const cart = carts.find(cart => cart.id === cartId);
    // Encontrar el producto con el ID proporcionado (puedes ajustar cómo buscas productos)
    const product = products.find(product => product.id === productId);
  
    if (!cart || !product) {
      return res.status(404).json({ mensaje: 'Carrito o producto no encontrado' });
    }
    // Comprobar si ya existe el producto en el carrito
    const existingProduct = cart.products.find(p => p.id === product.id);
  
    if (existingProduct) {
      // Si el producto ya existe, aumentar la cantidad
      existingProduct.quantity += 1;
    } else {
      // Si el producto no existe en el carrito, agregarlo con cantidad 1
      cart.products.push({ id: product.id, quantity: 1 });
    }
  
    res.status(201).json(cart);
});

// Obtener todos los carritos (GET)
app.get('/api/carts', (req, res) => {
    res.status(200).json(carts);
});
  
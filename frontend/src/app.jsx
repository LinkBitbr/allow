const { BrowserRouter, Routes, Route, Link, useParams, useNavigate } = ReactRouterDOM;

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 text-white p-4 sticky top-0 shadow">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="font-semibold">Loja</Link>
          <Link to="/cart" className="hover:underline">Carrinho</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const [products, setProducts] = React.useState([]);
  const [category, setCategory] = React.useState('');

  React.useEffect(() => {
    const url = category ? `/products?category=${category}` : '/products';
    axios.get(url).then(r => setProducts(r.data));
  }, [category]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2">
          <option value="">Todas categorias</option>
          <option value="celular">Celulares</option>
          <option value="notebook">Notebooks</option>
          <option value="fone">Fones</option>
          <option value="tv">TVs</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p._id} className="bg-white shadow rounded p-4 flex flex-col">
            <img src={p.image} alt={p.name} className="mb-2 h-40 object-cover" />
            <h3 className="font-semibold flex-1">{p.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{p.category}</p>
            <p className="font-bold mb-2">R$ {p.price.toFixed(2)}</p>
            <Link to={`/product/${p._id}`} className="bg-blue-600 text-white py-1 px-2 text-center rounded hover:bg-blue-700">Detalhes</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState(null);

  React.useEffect(() => {
    axios.get(`/products?id=${id}`).then(r => {
      const prod = r.data.find(p => p._id === id);
      setProduct(prod);
    });
  }, [id]);

  if (!product) return <p className="p-4">Carregando...</p>;

  const addToCart = () => {
    axios.post('/cart', { productId: id, quantity: 1 }).then(() => navigate('/cart'));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <img src={product.image} alt={product.name} className="md:w-1/2 object-cover rounded" />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <p className="font-bold text-xl mb-2">R$ {product.price.toFixed(2)}</p>
          <button onClick={addToCart} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Adicionar ao carrinho</button>
        </div>
      </div>
    </div>
  );
}

function CartPage() {
  const [items, setItems] = React.useState([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    axios.get('/cart').then(r => setItems(r.data));
  }, []);

  const remove = (id) => {
    axios.delete(`/cart/${id}`).then(r => setItems(r.data));
  };

  const checkout = () => {
    axios.post('/checkout', { items }).then(() => alert('Checkout efetuado (simulado)'));
  };

  const total = items.reduce((t, i) => t + i.product.price * i.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Carrinho</h2>
      {items.map(i => (
        <div key={i.product._id} className="flex items-center justify-between bg-white shadow p-2 mb-2 rounded">
          <span>{i.product.name} x {i.quantity}</span>
          <span>R$ {(i.product.price * i.quantity).toFixed(2)}</span>
          <button onClick={() => remove(i.product._id)} className="text-red-600">Remover</button>
        </div>
      ))}
      <div className="mt-4 font-bold">Total: R$ {total.toFixed(2)}</div>
      <button onClick={checkout} className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Finalizar Compra</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

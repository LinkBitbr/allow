const mongoose = require('mongoose');
const Product = require('../src/models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/electronics';

const products = [];
const categories = ['celular', 'notebook', 'fone', 'tv'];
const tags = ['Mais Vendido', 'Oferta'];

for (let i = 1; i <= 12; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  products.push({
    name: `Produto ${i}`,
    image: `https://via.placeholder.com/300?text=Produto+${i}`,
    description: `Descricao tecnica do produto ${i}`,
    price: parseFloat((Math.random() * 2000 + 500).toFixed(2)),
    stock: Math.floor(Math.random() * 50) + 1,
    rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    category,
    tag: tags[Math.floor(Math.random() * tags.length)]
  });
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Sample products inserted');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
  });

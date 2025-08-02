async function fetchVehicles() {
  const res = await fetch('/api/vehicles');
  return res.json();
}

document.getElementById('form-busca').addEventListener('submit', async (e) => {
  e.preventDefault();
  const lista = document.getElementById('resultado');
  lista.innerHTML = '';
  const data = await fetchVehicles();
  data.forEach(v => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<strong>${v.brand} ${v.model}</strong> - ${v.year} - $${v.price}`;
    lista.appendChild(div);
  });
});

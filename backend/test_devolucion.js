(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/devoluciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        detalle_entrega_id: 6,
        cantidad_devuelta: 1,
        causa: 'Mal estado'
      })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
})();

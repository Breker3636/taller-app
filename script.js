function iniciarSesion() {
  const rol = document.getElementById('rol').value;
  document.getElementById('loginPanel').classList.add('hidden');

  if (rol === 'cliente') {
    mostrarVehiculosCliente();
    document.getElementById('clientePanel').classList.remove('hidden');
  } else {
    cargarVehiculosParaTecnico();
    document.getElementById('tecnicoPanel').classList.remove('hidden');
  }
}

function cerrarSesion() {
  location.reload();
}

function registrarVehiculo() {
  const marca = document.getElementById('marca').value;
  const modelo = document.getElementById('modelo').value;
  const proximaRevision = document.getElementById('proximaRevision').value;
  const foto = document.getElementById('fotoVehiculo').files[0];

  if (!marca || !modelo || !proximaRevision) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const vehiculo = {
    id: Date.now(),
    marca,
    modelo,
    proximaRevision,
    fotoNombre: foto ? foto.name : null,
    estado: "En revisión",
    mantenimientos: []
  };

  let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
  vehiculos.push(vehiculo);
  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));

  mostrarVehiculosCliente();
  document.getElementById('marca').value = '';
  document.getElementById('modelo').value = '';
  document.getElementById('proximaRevision').value = '';
  document.getElementById('fotoVehiculo').value = '';
}

function mostrarVehiculosCliente() {
  const lista = document.getElementById('listaVehiculosCliente');
  lista.innerHTML = "";
  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

  vehiculos.forEach(v => {
    const li = document.createElement('li');
    li.textContent = `${v.marca} ${v.modelo} - Revisión: ${v.proximaRevision}`;
    lista.appendChild(li);
  });
}

function cargarVehiculosParaTecnico() {
  const contenedor = document.getElementById("listaVehiculosTecnico");
  contenedor.innerHTML = "";
  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

  vehiculos.forEach(v => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${v.marca} ${v.modelo}</strong> - Próxima revisión: ${v.proximaRevision}</p>
      <input type="text" placeholder="Añadir mantenimiento" id="mnt-${v.id}">
      <button onclick="guardarMantenimiento(${v.id})">Guardar</button>
      <ul id="listaMnt-${v.id}">${(v.mantenimientos || []).map(m => `<li>${m}</li>`).join('')}</ul>
      <hr>
    `;
    contenedor.appendChild(div);
  });
}

function guardarMantenimiento(id) {
  const input = document.getElementById(`mnt-${id}`);
  const nuevoMantenimiento = input.value.trim();
  if (!nuevoMantenimiento) return;

  let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
  const index = vehiculos.findIndex(v => v.id === id);
  if (index !== -1) {
    vehiculos[index].mantenimientos = vehiculos[index].mantenimientos || [];
    vehiculos[index].mantenimientos.push(nuevoMantenimiento);
    localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
    cargarVehiculosParaTecnico();
  }
}

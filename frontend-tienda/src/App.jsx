import { useEffect, useState } from "react";
import {
  obtenerTodosProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "./services/productosService";

const FORM_INICIAL = {
  proCodigo: "",
  proNombre: "",
  proPrecio: "",
  proCategoria: "",
};

export default function App() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editId, setEditId] = useState(null);
  const [buscarId, setBuscarId] = useState("");
  const [productoBuscado, setProductoBuscado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarProductos = async () => {
    setError("");
    try {
      const lista = await obtenerTodosProductos();
      setProductos(lista);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    const payload = {
      proCodigo: form.proCodigo.trim(),
      proNombre: form.proNombre.trim(),
      proPrecio: Number(form.proPrecio),
      proCategoria: form.proCategoria.trim(),
    };

    try {
      if (editId !== null) {
        const res = await actualizarProducto(editId, payload);
        setMensaje(res.mensaje || "Producto actualizado");
        setEditId(null);
      } else {
        const res = await crearProducto(payload);
        setMensaje(res.mensaje || "Producto agregado correctamente");
      }
      setForm(FORM_INICIAL);
      await cargarProductos();
    } catch (err) {
      setError(err.message);
    }
  };

  const iniciarEdicion = (prod) => {
    setMensaje("");
    setError("");
    setEditId(prod.idProducto);
    setForm({
      proCodigo: prod.proCodigo,
      proNombre: prod.proNombre,
      proPrecio: prod.proPrecio,
      proCategoria: prod.proCategoria,
    });
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setForm(FORM_INICIAL);
  };

  const handleEliminar = async (idProducto) => {
    setMensaje("");
    setError("");
    try {
      const res = await eliminarProducto(idProducto);
      setMensaje(res.mensaje || "Producto eliminado");
      if (editId === idProducto) cancelarEdicion();
      if (productoBuscado?.idProducto === idProducto) setProductoBuscado(null);
      await cargarProductos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBuscarPorId = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setProductoBuscado(null);

    if (!buscarId.trim()) {
      setError("Ingresa un ID para consultar");
      return;
    }

    try {
      const prod = await obtenerProductoPorId(buscarId.trim());
      setProductoBuscado(prod);
      setMensaje("Producto encontrado");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main style={{ maxWidth: 850, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Tienda ADSO - Gestión de Productos</h1>

      {mensaje && <p style={{ color: "green", fontWeight: "bold" }}>{mensaje}</p>}
      {error && <p style={{ color: "crimson", fontWeight: "bold" }}>{error}</p>}

      
      <section style={{ marginBottom: "2rem" }}>
        <h2>{editId !== null ? `Actualizar Producto #${editId}` : "Agregar Producto"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.5rem", maxWidth: 420 }}>
          <input
            name="proCodigo"
            placeholder="Código (ej. PROD001)"
            value={form.proCodigo}
            onChange={handleChange}
            required
          />
          <input
            name="proNombre"
            placeholder="Nombre del producto"
            value={form.proNombre}
            onChange={handleChange}
            required
          />
          <input
            name="proPrecio"
            type="number"
            step="any"
            placeholder="Precio"
            value={form.proPrecio}
            onChange={handleChange}
            required
          />
          <input
            name="proCategoria"
            placeholder="Categoría"
            value={form.proCategoria}
            onChange={handleChange}
            required
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit">
              {editId !== null ? "Guardar Cambios" : "Agregar Producto"}
            </button>
            {editId !== null && (
              <button type="button" onClick={cancelarEdicion}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      
      <section style={{ marginBottom: "2rem" }}>
        <h2>Consultar Producto por ID</h2>
        <form onSubmit={handleBuscarPorId} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="number"
            placeholder="ID del producto"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button type="submit">Buscar</button>
          <button
            type="button"
            onClick={() => {
              setProductoBuscado(null);
              setBuscarId("");
              cargarProductos();
            }}
          >
            Mostrar Todos
          </button>
        </form>

        {productoBuscado && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", border: "1px solid #ccc" }}>
            <strong>ID:</strong> {productoBuscado.idProducto} |{" "}
            <strong>Código:</strong> {productoBuscado.proCodigo} |{" "}
            <strong>Nombre:</strong> {productoBuscado.proNombre} |{" "}
            <strong>Precio:</strong> ${productoBuscado.proPrecio} |{" "}
            <strong>Categoría:</strong> {productoBuscado.proCategoria}
          </div>
        )}
      </section>

   
      <section>
        <h2>Listado de Productos</h2>
        <table border="1" cellPadding="8" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="6" align="center">
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              productos.map((prod) => (
                <tr key={prod.idProducto}>
                  <td>{prod.idProducto}</td>
                  <td>{prod.proCodigo}</td>
                  <td>{prod.proNombre}</td>
                  <td>${prod.proPrecio}</td>
                  <td>{prod.proCategoria}</td>
                  <td>
                    <button onClick={() => iniciarEdicion(prod)} style={{ marginRight: "0.5rem" }}>
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(prod.idProducto)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
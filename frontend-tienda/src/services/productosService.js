const BASE_URL = "http://127.0.0.1:5000/api/v1/productos";

export async function obtenerTodosProductos() {
  const res = await fetch(`${BASE_URL}/`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || "Error al obtener productos");
  return data.Productos || [];
}

export async function obtenerProductoPorId(idProducto) {
  const res = await fetch(`${BASE_URL}/${idProducto}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || "Producto no encontrado");
  return data.Producto;
}

export async function crearProducto(producto) {
  const res = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || "Error al crear producto");
  return data;
}

export async function actualizarProducto(idProducto, producto) {
  const res = await fetch(`${BASE_URL}/${idProducto}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || "Error al actualizar producto");
  return data;
}

export async function eliminarProducto(idProducto) {
  const res = await fetch(`${BASE_URL}/${idProducto}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || "Error al eliminar producto");
  return data;
}
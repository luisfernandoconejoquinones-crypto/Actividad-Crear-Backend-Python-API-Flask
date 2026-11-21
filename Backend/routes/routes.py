from flask import request, jsonify
from sqlalchemy import exc
from app import api, db
from models.producto import Producto


@api.route("/api/v1/productos/", methods=["POST"])
def crearProducto():
    try:
        datos = request.get_json(force=True) or {}
        campos = ["proCodigo", "proNombre", "proPrecio", "proCategoria"]
        if not all(c in datos and str(datos[c]).strip() != "" for c in campos):
            return jsonify({
                "mensaje": "Faltan datos obligatorios (proCodigo, proNombre, proPrecio, proCategoria)"
            }), 400

        producto = Producto(
            proCodigo=str(datos["proCodigo"]).strip(),
            proNombre=str(datos["proNombre"]).strip(),
            proPrecio=float(datos["proPrecio"]),
            proCategoria=str(datos["proCategoria"]).strip(),
        )
        db.session.add(producto)
        db.session.commit()
        return jsonify({
            "mensaje": "Producto Agregado correctamente",
            "Producto": producto.to_dict(),
        }), 201
    except ValueError:
        db.session.rollback()
        return jsonify({"mensaje": "proPrecio debe ser un número válido"}), 400
    except exc.SQLAlchemyError as error:
        db.session.rollback()
        return jsonify({"mensaje": str(error)}), 400


@api.route("/api/v1/productos/", methods=["GET"])
def obtenerProductos():
    try:
        productos = Producto.query.all()
        listaProductos = [p.to_dict() for p in productos]
        return jsonify({
            "mensaje": "Productos",
            "Productos": listaProductos,
        }), 200
    except exc.SQLAlchemyError as error:
        return jsonify({"mensaje": str(error)}), 500


@api.route("/api/v1/productos/<int:idProducto>", methods=["GET"])
def obtenerProductoPorID(idProducto):
    try:
        producto = Producto.query.get(idProducto)
        if producto is None:
            return jsonify({"mensaje": "No existe producto con ese ID"}), 404

        return jsonify({
            "mensaje": "Producto encontrado",
            "Producto": producto.to_dict(),
        }), 200
    except exc.SQLAlchemyError as error:
        return jsonify({"mensaje": str(error)}), 500


@api.route("/api/v1/productos/<int:idProducto>", methods=["PUT"])
def actualizarProducto(idProducto):
    try:
        producto = Producto.query.get(idProducto)
        if producto is None:
            return jsonify({"mensaje": "No existe producto con ese ID"}), 404

        datos = request.get_json(force=True) or {}
        if "proCodigo" in datos and str(datos["proCodigo"]).strip() != "":
            producto.proCodigo = str(datos["proCodigo"]).strip()
        if "proNombre" in datos and str(datos["proNombre"]).strip() != "":
            producto.proNombre = str(datos["proNombre"]).strip()
        if "proPrecio" in datos and str(datos["proPrecio"]).strip() != "":
            producto.proPrecio = float(datos["proPrecio"])
        if "proCategoria" in datos and str(datos["proCategoria"]).strip() != "":
            producto.proCategoria = str(datos["proCategoria"]).strip()

        db.session.commit()
        return jsonify({
            "mensaje": "Producto actualizado",
            "Producto": producto.to_dict(),
        }), 200
    except ValueError:
        db.session.rollback()
        return jsonify({"mensaje": "proPrecio debe ser un número válido"}), 400
    except exc.SQLAlchemyError as error:
        db.session.rollback()
        return jsonify({"mensaje": str(error)}), 500


@api.route("/api/v1/productos/<int:idProducto>", methods=["DELETE"])
def eliminarProducto(idProducto):
    try:
        producto = Producto.query.get(idProducto)
        if producto is None:
            return jsonify({"mensaje": "No existe producto con ese ID"}), 404

        db.session.delete(producto)
        db.session.commit()
        return jsonify({"mensaje": "Producto Eliminado"}), 200
    except exc.SQLAlchemyError as error:
        db.session.rollback()
        return jsonify({"mensaje": str(error)}), 500
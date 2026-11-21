from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import *

api = Flask(__name__)

cors = CORS(api)

cadenaConexion = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
api.config['SQLALCHEMY_DATABASE_URI'] = cadenaConexion
api.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(api)

from routes.routes import *

if __name__ == '__main__':
    with api.app_context():
        db.create_all()
    api.run(port=5000, debug=True)
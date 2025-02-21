from flask import Flask , Request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import pymysql.cursors
from routes.users import user_routes
from routes.auth import auth_routes
from routes.equipment import equipment_routes
from routes.usage_history import usage_history_routes
from routes.maintenance import maintenance_routes
from routes.logs import logs_routes


app = Flask(__name__)

app.config['JWT_SECRET_KEY']= 'your_jwt_secret_key_here'
jwt = JWTManager(app)

CORS(app, supports_credentials=True, resources={r"/api/*": {
    "origins": "http://localhost:3000",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization","Access-Control-Allow-Credentials"]
}})

@app.route('/')
def home():
    return {"message": "Ekipman Takip API Calisiyor!"}

# Kullanıcı işlemlerini yöneten route'u ekleyelim
app.register_blueprint(user_routes, url_prefix="/api/users")
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(equipment_routes, url_prefix="/api/equipment")
app.register_blueprint(usage_history_routes, url_prefix="/api/usage_history")
app.register_blueprint(maintenance_routes, url_prefix="/api/maintenance")
app.register_blueprint(logs_routes, url_prefix="/api/logs")
@app.route("/api/<path:path>", methods=["OPTIONS"])
def handle_options(path):
    response = jsonify({"message": "CORS Preflight OK"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization, Access-Control-Allow-Credentials")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response, 200 


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
    

print(app.url_map)

from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes.users import user_routes
from routes.auth import auth_routes
from routes.equipment import equipment_routes
from routes.usage_history import usage_history_routes
from routes.maintenance import maintenance_routes
from routes.logs import logs_routes
from routes.categories import category_routes

app = Flask(__name__)

# JWT Ayarları
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key_here'
jwt = JWTManager(app)

# CORS Ayarları - Tüm Uygulamaya Uygula
CORS(app, supports_credentials=True, origins="http://localhost:3000")

# Preflight (OPTIONS) isteklerine yanıt ver
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 200

# Ana Sayfa
@app.route('/')
def home():
    return {"message": "Ekipman Takip API Çalışıyor!"}

# Blueprint'leri ekleyelim (CORS'u burada kullanmıyoruz!)
app.register_blueprint(user_routes, url_prefix="/api/users")
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(equipment_routes, url_prefix="/api/equipment")
app.register_blueprint(usage_history_routes, url_prefix="/api/usage_history")
app.register_blueprint(maintenance_routes, url_prefix="/api/maintenance")
app.register_blueprint(logs_routes, url_prefix="/api/logs")
app.register_blueprint(category_routes, url_prefix="/api")

if __name__ == "__main__":
    with app.app_context():
        print(app.url_map)
    app.run(host="127.0.0.1", port=5000, debug=True)

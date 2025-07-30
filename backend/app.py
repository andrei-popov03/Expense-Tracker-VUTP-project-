from flask import Flask
from flask_cors import CORS
from conf import Config
from extensions import db, jwt, migrate

#finances
from finances import finance_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)


    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    app.register_blueprint(finance_bp)
    

    # Enable CORS (allow React frontend)
    # CORS(app, resources={r"/*": {"origins": "*"}})

    from routes import auth_bp
    app.register_blueprint(auth_bp)

    # with app.app_context():
    #     from models import User
    #     db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host="0.0.0.0", port=5000 ,debug=True)
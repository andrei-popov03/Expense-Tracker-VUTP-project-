from flask import Flask, request
from flask_cors import CORS
from conf import Config
from extensions import db, jwt, migrate

from finances import finance_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True,
        # Must explicitly list Authorization or the preflight check rejects it
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Preflight requests never carry Authorization, so JWT would reject them
    # with 401. Intercept here and return 200 — Flask-CORS adds its headers.
    @app.before_request
    def handle_preflight():
        if request.method == 'OPTIONS':
            return '', 200


    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    app.register_blueprint(finance_bp)
    

    from routes import auth_bp
    app.register_blueprint(auth_bp)

    with app.app_context():
         from models import User, Income, Expense, RecurringTransaction, BudgetLimit
         db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host="0.0.0.0", port=5000 ,debug=True)
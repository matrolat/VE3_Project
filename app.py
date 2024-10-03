from flask import Flask, jsonify, request # type: ignore
from flask_sqlalchemy import SQLAlchemy # type: ignore
from flask_cors import CORS # type: ignore
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity # type: ignore
import datetime
from flask_bcrypt import Bcrypt # type: ignore
import os
from flask import send_from_directory # type: ignore

# # Serve React App
# @app.route('/', defaults={'path': ''}) # type: ignore
# @app.route('/<path:path>') # type: ignore
# def serve(path):
#     if path != "" and os.path.exists("task-manager-frontend/build/" + path):
#         return send_from_directory('task-manager-frontend/build', path)
#     else:
#         return send_from_directory('task-manager-frontend/build', 'index.html')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['JWT_SECRET_KEY'] = 'VE3PROJECT'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False)
    password = db.Column(db.String(150), nullable=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    completed = db.Column(db.Boolean, default=False)

with app.app_context():
    db.create_all()

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={'username': user.username}, expires_delta=datetime.timedelta(hours=1))
        return jsonify({'token': access_token}), 200
    return jsonify({"message": "Invalid credentials"}), 401

# GET/tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'completed': task.completed
    } for task in tasks])

#GET/tasks/:id
@app.route('/tasks/<int:id>', methods=['GET'])
def get_task(id):
    task = Task.query.get(id)
    if task:
        return jsonify({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'completed': task.completed
        })
    return jsonify({'error': 'Task not found!'}), 404

#POST/tasks
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    if 'title' not in data or 'description' not in data:
        return jsonify({'error': 'Title and description are required!'}), 400
    
    new_task = Task(title=data['title'], description=data['description'])
    db.session.add(new_task)
    db.session.commit()
    
    return jsonify({
        'message': 'Task created.',
        'task': {
            'id': new_task.id,
            'title': new_task.title,
            'description': new_task.description,
            'completed': new_task.completed
        }
    }), 201

#PUT /tasks/:id
@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    if task:
        data = request.json
        if 'title' not in data or 'description' not in data or 'completed' not in data:
            return jsonify({'error': 'Title, description, and completed status are required!'}), 400
        
        task.title = data['title']
        task.description = data['description']
        task.completed = data['completed']
        
        db.session.commit()
        return jsonify({'message': 'Task updated!'})
    return jsonify({'error': 'Task not found!'}), 404
    
#DELETE/tasks/:id
@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted.'})
    return jsonify({'error': 'Task not found!'}), 404

# if __name__ == '__main__':
#     app.run(debug=True)
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
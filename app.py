from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'  # Change to PostgreSQL for production
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    completed = db.Column(db.Boolean, default=False)

with app.app_context():
    db.create_all()

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'completed': task.completed
    } for task in tasks])

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

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    # Validate input
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

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    if task:
        data = request.json
        # Validate input
        if 'title' not in data or 'description' not in data or 'completed' not in data:
            return jsonify({'error': 'Title, description, and completed status are required!'}), 400
        
        task.title = data['title']
        task.description = data['description']
        task.completed = data['completed']
        
        db.session.commit()
        return jsonify({'message': 'Task updated!'})
    return jsonify({'error': 'Task not found!'}), 404
    
@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted.'})
    return jsonify({'error': 'Task not found!'}), 404

if __name__ == '__main__':
    app.run(debug=True)

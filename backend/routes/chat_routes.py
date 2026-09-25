from flask import Blueprint, request, jsonify
from backend.services.ai_chat_service import generate_ai_response

chat_bp = Blueprint('chat', __name__, url_prefix='/api')

@chat_bp.route('/chat', methods=['POST'])
def handle_chat():
    data = request.get_json() or {}
    message = data.get('message', '').strip()

    if not message:
        return jsonify({'error': 'Please provide a valid question or message.'}), 400

    reply = generate_ai_response(message)
    return jsonify({
        'question': message,
        'response': reply
    }), 200

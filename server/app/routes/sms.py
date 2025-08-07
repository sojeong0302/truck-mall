# server/routes/sms.py
from flask import Blueprint, request, jsonify
from twilio.rest import Client
import os

sms_bp = Blueprint("sms", __name__, url_prefix="/sms")

# 환경변수에서 Twilio 정보 불러오기
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE_NUMBER")
client = Client(account_sid, auth_token)


@sms_bp.route("/send", methods=["POST"])
def send_sms():
    data = request.get_json()
    to = data.get("to")
    body = data.get("body")

    try:
        message = client.messages.create(body=body, from_=twilio_number, to=to)
        return jsonify({"status": "success", "sid": message.sid})
    except Exception as e:
        return jsonify({"status": "fail", "error": str(e)}), 500

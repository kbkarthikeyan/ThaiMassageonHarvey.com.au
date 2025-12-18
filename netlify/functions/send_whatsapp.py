"""
Netlify Serverless Function - WhatsApp Booking Notifications
Sends automated WhatsApp messages to owner and client upon booking
"""

import json
import os
import requests
from datetime import datetime

def handler(event, context):
    """
    Netlify Function Handler
    Receives booking data and sends WhatsApp messages via WhatsApp Business API
    """

    # Only allow POST requests
    if event['httpMethod'] != 'POST':
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }

    try:
        # Parse request body
        body = json.loads(event['body'])

        # Get booking details
        service = body.get('service', 'Not specified')
        date = body.get('date', '')
        time = body.get('time', '')
        duration = body.get('duration', '')
        name = body.get('name', '')
        email = body.get('email', '')
        phone = body.get('phone', '')

        # Validate required fields
        if not all([service, date, time, duration, name, phone]):
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing required fields'})
            }

        # Get WhatsApp API credentials from environment variables
        PHONE_NUMBER_ID = os.environ.get('WHATSAPP_PHONE_NUMBER_ID')
        ACCESS_TOKEN = os.environ.get('WHATSAPP_ACCESS_TOKEN')
        OWNER_PHONE = os.environ.get('OWNER_PHONE', '61401818848')

        if not PHONE_NUMBER_ID or not ACCESS_TOKEN:
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'error': 'WhatsApp API not configured. Please set environment variables in Netlify.'
                })
            }

        # Format date
        try:
            date_obj = datetime.strptime(date, '%Y-%m-%d')
            formatted_date = date_obj.strftime('%A, %d %B %Y')
        except:
            formatted_date = date

        # Format client phone to international format
        client_phone = phone.replace(' ', '').replace('-', '')
        if client_phone.startswith('0'):
            client_phone = '61' + client_phone[1:]
        elif not client_phone.startswith('61'):
            client_phone = '61' + client_phone

        # Create messages
        owner_message = (
            f"🆕 NEW BOOKING ALERT!\n\n"
            f"👤 Client: {name}\n"
            f"📧 Email: {email}\n"
            f"📱 Phone: {phone}\n\n"
            f"💆 Service: {service}\n"
            f"📅 Date: {formatted_date}\n"
            f"⏰ Time: {time}\n"
            f"⏱️ Duration: {duration} minutes\n\n"
            f"Please confirm this appointment with the client."
        )

        client_message = (
            f"✅ Booking Confirmed!\n\n"
            f"Thank you {name} for choosing Thai Massage on Harvey!\n\n"
            f"📋 Your booking details:\n"
            f"💆 Service: {service}\n"
            f"📅 Date: {formatted_date}\n"
            f"⏰ Time: {time}\n"
            f"⏱️ Duration: {duration} minutes\n\n"
            f"📍 Location: 4 Harvey Cct, Mawson Lakes, SA 5095\n"
            f"📞 Contact: 0401 818 848\n\n"
            f"We look forward to seeing you!\n"
            f"If you need to reschedule, please reply to this message. 🙏"
        )

        # WhatsApp API URL
        api_url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"
        headers = {
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Content-Type": "application/json"
        }

        # Send to OWNER
        owner_payload = {
            "messaging_product": "whatsapp",
            "to": OWNER_PHONE,
            "type": "text",
            "text": {"body": owner_message}
        }
        owner_response = requests.post(api_url, headers=headers, json=owner_payload)

        # Send to CLIENT
        client_payload = {
            "messaging_product": "whatsapp",
            "to": client_phone,
            "type": "text",
            "text": {"body": client_message}
        }
        client_response = requests.post(api_url, headers=headers, json=client_payload)

        # Check if both messages sent successfully
        if owner_response.status_code == 200 and client_response.status_code == 200:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'WhatsApp messages sent successfully to both owner and client!'
                })
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Failed to send WhatsApp messages',
                    'owner_status': owner_response.status_code,
                    'client_status': client_response.status_code
                })
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }

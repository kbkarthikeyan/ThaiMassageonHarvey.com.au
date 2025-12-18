/**
 * Netlify Serverless Function - WhatsApp Booking Notifications
 * Sends automated WhatsApp messages to owner and client upon booking
 */

const https = require('https');

// Helper function to make HTTPS requests
function httpsRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Send WhatsApp message via WhatsApp Business API
async function sendWhatsAppMessage(phoneNumberId, accessToken, toPhone, message) {
  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  const payload = JSON.stringify({
    messaging_product: 'whatsapp',
    to: toPhone,
    type: 'text',
    text: {
      body: message
    }
  });

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  try {
    const response = await httpsRequest(url, options, payload);
    return {
      success: response.statusCode === 200,
      data: response.body
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Format date to Australian format
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

// Convert Australian phone to international format
function formatPhoneInternational(phone) {
  phone = phone.replace(/[\s\-]/g, '');
  if (phone.startsWith('0')) {
    return '61' + phone.substring(1);
  } else if (!phone.startsWith('61')) {
    return '61' + phone;
  }
  return phone;
}

// Main Netlify Function Handler
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const data = JSON.parse(event.body);

    // Get booking details
    const { service, date, time, duration, name, email, phone } = data;

    // Validate required fields
    if (!service || !date || !time || !duration || !name || !phone) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Get WhatsApp API credentials from environment variables
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const OWNER_PHONE = process.env.OWNER_PHONE || '393495565607';

    console.log('Phone Number ID:', PHONE_NUMBER_ID ? 'Set' : 'Missing');
    console.log('Access Token:', ACCESS_TOKEN ? 'Set (length: ' + ACCESS_TOKEN.length + ')' : 'Missing');
    console.log('Owner Phone:', OWNER_PHONE);

    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'WhatsApp API not configured. Please set environment variables in Netlify.'
        })
      };
    }

    // Format data
    const formattedDate = formatDate(date);
    const clientPhoneInternational = formatPhoneInternational(phone);

    // Create message for OWNER
    const ownerMessage = `🆕 NEW BOOKING ALERT!\n\n` +
      `👤 Client: ${name}\n` +
      `📧 Email: ${email}\n` +
      `📱 Phone: ${phone}\n\n` +
      `💆 Service: ${service}\n` +
      `📅 Date: ${formattedDate}\n` +
      `⏰ Time: ${time}\n` +
      `⏱️ Duration: ${duration} minutes\n\n` +
      `Please confirm this appointment with the client.`;

    // Create message for CLIENT
    const clientMessage = `✅ Booking Confirmed!\n\n` +
      `Thank you ${name} for choosing Thai Massage on Harvey!\n\n` +
      `📋 Your booking details:\n` +
      `💆 Service: ${service}\n` +
      `📅 Date: ${formattedDate}\n` +
      `⏰ Time: ${time}\n` +
      `⏱️ Duration: ${duration} minutes\n\n` +
      `📍 Location: 4 Harvey Cct, Mawson Lakes, SA 5095\n` +
      `📞 Contact: 0401 818 848\n\n` +
      `We look forward to seeing you!\n` +
      `If you need to reschedule, please reply to this message. 🙏`;

    // Send WhatsApp to OWNER
    console.log('Sending to owner:', OWNER_PHONE);
    const ownerResult = await sendWhatsAppMessage(
      PHONE_NUMBER_ID,
      ACCESS_TOKEN,
      OWNER_PHONE,
      ownerMessage
    );
    console.log('Owner result:', JSON.stringify(ownerResult));

    // Send WhatsApp to CLIENT
    console.log('Sending to client:', clientPhoneInternational);
    const clientResult = await sendWhatsAppMessage(
      PHONE_NUMBER_ID,
      ACCESS_TOKEN,
      clientPhoneInternational,
      clientMessage
    );
    console.log('Client result:', JSON.stringify(clientResult));

    // Check results
    if (ownerResult.success && clientResult.success) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: true,
          message: 'WhatsApp messages sent successfully to both owner and client!'
        })
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Booking received but some messages failed to send.',
          ownerSent: ownerResult.success,
          clientSent: clientResult.success,
          errors: {
            owner: ownerResult.error,
            client: clientResult.error
          }
        })
      };
    }

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

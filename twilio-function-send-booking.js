/**
 * Twilio Function: Send WhatsApp Booking Confirmation
 *
 * Deploy this in Twilio Console → Functions and Assets → Services
 *
 * Path: /send-booking
 *
 * Environment Variables needed in Twilio:
 * - WHATSAPP_FROM: Your approved WhatsApp number (e.g., whatsapp:+61401818848)
 */

exports.handler = async function(context, event, callback) {
  // Enable CORS for your website
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return callback(null, response);
  }

  try {
    const client = context.getTwilioClient();

    // Get booking details from request
    const { service, date, time, duration, name, email, phone } = event;

    // Validate required fields
    if (!service || !date || !time || !duration || !name || !phone) {
      response.setBody({
        success: false,
        error: 'Missing required fields'
      });
      response.setStatusCode(400);
      return callback(null, response);
    }

    // Format date to Australian format
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Format client phone to international format with WhatsApp prefix
    let clientPhone = phone.replace(/[\s\-]/g, '');
    if (clientPhone.startsWith('0')) {
      clientPhone = '+61' + clientPhone.substring(1);
    } else if (!clientPhone.startsWith('+')) {
      // If already international format without +
      if (clientPhone.startsWith('61')) {
        clientPhone = '+' + clientPhone;
      } else if (clientPhone.startsWith('3')) {
        // Italian or other international
        clientPhone = '+' + clientPhone;
      } else {
        // Assume Australian
        clientPhone = '+61' + clientPhone;
      }
    }

    // Create WhatsApp message for CLIENT
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

    console.log('Sending WhatsApp to:', clientPhone);

    // Send WhatsApp message to CLIENT
    const message = await client.messages.create({
      from: context.WHATSAPP_FROM, // Your approved WhatsApp sender (set in Environment Variables)
      to: `whatsapp:${clientPhone}`,
      body: clientMessage
    });

    console.log('Message sent successfully:', message.sid);

    response.setBody({
      success: true,
      message: 'WhatsApp booking confirmation sent successfully!',
      messageSid: message.sid
    });

    return callback(null, response);

  } catch (error) {
    console.error('Error sending WhatsApp:', error);

    response.setBody({
      success: false,
      error: error.message,
      details: error.code || 'Unknown error'
    });
    response.setStatusCode(500);

    return callback(null, response);
  }
};

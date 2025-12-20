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

    // Get owner phone from environment variable
    const ownerPhone = context.OWNER_PHONE;

    // Create WhatsApp message for OWNER (booking alert)
    const ownerMessage = `🆕 NEW BOOKING ALERT!\n\n` +
      `👤 Client: ${name}\n` +
      `📧 Email: ${email}\n` +
      `📱 Phone: ${phone}\n\n` +
      `💆 Service: ${service}\n` +
      `📅 Date: ${formattedDate}\n` +
      `⏰ Time: ${time}\n` +
      `⏱️ Duration: ${duration} minutes\n\n` +
      `Please confirm this appointment with the client.`;

    console.log('Sending WhatsApp booking alert to owner:', ownerPhone);

    // Send WhatsApp message to OWNER
    const message = await client.messages.create({
      from: context.WHATSAPP_FROM, // Twilio WhatsApp number
      to: `whatsapp:${ownerPhone}`,
      body: ownerMessage
    });

    console.log('Message sent successfully:', message.sid);

    response.setBody({
      success: true,
      message: 'Booking alert sent to owner via WhatsApp!',
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

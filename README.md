# Thai Massage on Harvey

A professional landing page for Thai Massage on Harvey spa business in Mawson Lakes, Adelaide, South Australia.

## Features

### 🌐 Landing Page
- Clean, responsive design
- Service showcase with pricing
- Customer testimonials
- Google Maps integration
- Mobile-friendly layout

### 📱 WhatsApp-Enabled Booking System
- **Automated booking notifications** via WhatsApp
- **Real-time alerts** to business owner when customers book
- **Email notifications** as backup (via web3forms)
- Professional booking form with service selection, date/time picker

### 💆 Services Offered
- Oil Relaxation Massage
- Deep Tissue Massage
- Aromatherapy
- Foot Massage
- Coconut Oil Massage
- Head-Shoulder-Neck Massage
- Traditional Thai Massage

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **WhatsApp Integration**: Twilio WhatsApp Business API
- **Backend**: Twilio Serverless Functions
- **Email**: Web3Forms API
- **Hosting**: Static site (GitHub Pages compatible)

## Setup

### Prerequisites
- Twilio account with WhatsApp Business API access
- Web3Forms account for email notifications

### Environment Variables (Twilio)

Configure in Twilio Functions:
```
WHATSAPP_FROM=whatsapp:+[your-twilio-whatsapp-number]
OWNER_PHONE=+[owner-phone-number]
```

### Deployment

1. **Deploy Twilio Function**:
   - Copy `twilio-function-send-booking.js` to Twilio Console
   - Set environment variables
   - Deploy function

2. **Host Website**:
   - Upload `tindex.html` to your web host
   - Or deploy to GitHub Pages
   - Update function URL in the booking form code

## How It Works

1. **Customer** fills out booking form on website
2. **WhatsApp notification** sent to owner with booking details
3. **Email notification** sent to owner as backup
4. **Customer** sees confirmation message
5. **Owner** confirms appointment with customer

## Contact

**Business**: Thai Massage on Harvey
**Location**: 4 Harvey Cct, Mawson Lakes, SA 5095, Australia
**Phone**: 0401 818 848
**Email**: penthanaporn@gmail.com
**Website**: https://thaimassageonharvey.com.au

## License

© 2025 Thai Massage on Harvey. All rights reserved.

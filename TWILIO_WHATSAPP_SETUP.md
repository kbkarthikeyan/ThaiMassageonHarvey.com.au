# Twilio WhatsApp Business Setup Guide

## Current Status: ⏳ Waiting for Approval

Once your WhatsApp Business Profile is approved by Meta/WhatsApp (1-3 weeks), follow these steps:

---

## Step 1: Deploy Twilio Function

### 1.1 Create the Function

1. **Go to Twilio Console**: https://console.twilio.com/
2. **Navigate to**: Explore Products → Developer tools → **Functions and Assets** → **Services**
3. **Click**: "Create Service"
   - Name: `whatsapp-booking`
   - Click "Next"

### 1.2 Add the Function

4. **Click**: "Add +" → "Add Function"
   - Path: `/send-booking`
   - Click "Add"

5. **Copy the code** from `twilio-function-send-booking.js` in this folder
6. **Paste** it into the function editor
7. **Click**: "Save"

### 1.3 Set Environment Variables

8. **Click**: "Environment Variables" (left sidebar)
9. **Click**: "Add" and create:
   - **Key**: `WHATSAPP_FROM`
   - **Value**: `whatsapp:+61401818848` (your approved WhatsApp number)
10. **Click**: "Deploy All"

### 1.4 Get Your Function URL

After deployment, you'll see:
- **URL**: `https://whatsapp-booking-XXXX-dev.twil.io/send-booking`
- **Copy this URL** - you'll need it for Step 2

---

## Step 2: Update Your Website

### 2.1 Update tindex.html

Replace the SMS section in `tindex.html` with Twilio WhatsApp:

**Find this code** (around line 634):
```javascript
// SMS Booking Notification - Simple Solution
```

**Replace with**:
```javascript
// Twilio WhatsApp Booking Notification
document.getElementById('booking-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form values
    const service = document.querySelector('input[name="person1[]"]:checked')?.value || 'Not selected';
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const duration = document.getElementById('duration').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Validate
    if (service === 'Not selected') {
        alert('Please select a service type');
        return;
    }

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p style="color: blue; margin-top: 1rem;">⏳ Processing booking...</p>';

    try {
        // Call Twilio Function to send WhatsApp
        const response = await fetch('https://YOUR-TWILIO-FUNCTION-URL/send-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service, date, time, duration, name, email, phone
            })
        });

        const result = await response.json();

        // Also send email notification to owner
        const formData = new FormData(this);
        await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        if (result.success) {
            resultDiv.innerHTML =
                '<p style="color: green; margin-top: 1rem; font-weight: bold;">✅ Booking confirmed! WhatsApp confirmation sent.</p>';
        } else {
            resultDiv.innerHTML =
                '<p style="color: orange; margin-top: 1rem;">⚠️ Booking received. Email sent but WhatsApp failed.</p>';
        }

        // Reset form
        setTimeout(() => {
            this.reset();
            resultDiv.innerHTML = '';
        }, 3000);

    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML =
            '<p style="color: red; margin-top: 1rem;">❌ Error submitting. Please call 0401 818 848.</p>';
    }
});
```

**Important**: Replace `YOUR-TWILIO-FUNCTION-URL` with the actual URL from Step 1.4

### 2.2 Push to GitHub

```bash
git add tindex.html
git commit -m "Add Twilio WhatsApp integration"
git push
```

---

## Step 3: Test Everything

1. **Go to your website**
2. **Fill out the booking form**
3. **Submit**
4. **Check**:
   - ✅ Customer receives WhatsApp confirmation
   - ✅ Owner receives email notification

---

## Costs (After Free Trial)

- **Twilio Free Trial**: $15 credit
- **WhatsApp Business (per message)**:
  - First 1,000 conversations/month: FREE
  - After that: ~$0.005 per message
- **Estimated monthly cost**: $0-5 (for a small business)

---

## Troubleshooting

### WhatsApp not sending?

**Check Twilio Function Logs:**
1. Go to: Functions and Assets → Services → whatsapp-booking
2. Click: Logs
3. Look for errors

**Common Issues:**
- ❌ "WHATSAPP_FROM not set" → Add environment variable
- ❌ "Invalid phone number" → Check phone format
- ❌ "Not approved sender" → WhatsApp profile not approved yet

---

## Next Steps

1. ⏳ **Wait for WhatsApp Business approval** (1-3 weeks)
2. ✅ **Deploy Twilio Function** (follow Step 1)
3. ✅ **Update website** (follow Step 2)
4. ✅ **Test** (follow Step 3)

---

**Questions?** Check Twilio docs: https://www.twilio.com/docs/whatsapp

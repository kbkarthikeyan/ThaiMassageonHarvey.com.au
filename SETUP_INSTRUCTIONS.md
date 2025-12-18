# WhatsApp Automated Booking Setup Instructions

This guide will help you deploy your website to Netlify with automated WhatsApp notifications for bookings.

## Overview
When a customer submits a booking:
1. **Owner** receives a WhatsApp message with booking details
2. **Client** receives a WhatsApp confirmation message
3. **Email backup** is sent via web3forms

---

## Step 1: Get WhatsApp Business API Credentials

### Option A: Meta (Facebook) WhatsApp Business API (Free Tier Available)

1. **Go to Meta for Developers**
   - Visit: https://developers.facebook.com/
   - Sign in with your Facebook account

2. **Create or Select an App**
   - Click "My Apps" → "Create App"
   - Select "Business" as app type
   - Fill in app details and create

3. **Add WhatsApp Product**
   - In your app dashboard, click "Add Product"
   - Find "WhatsApp" and click "Set Up"

4. **Get Your Credentials**
   - After setup, you'll see:
     - **Phone Number ID** (looks like: 123456789012345)
     - **Access Token** (long string starting with "EAAA...")
   - **IMPORTANT**: Copy these values - you'll need them for Netlify

5. **Verify Your Business Phone Number**
   - Follow the verification steps
   - This is the number WhatsApp messages will be sent FROM
   - You can use your existing business number (0401 818 848)

6. **Test Number Setup** (Optional for testing)
   - Add test phone numbers in the dashboard
   - You can test with your own phone first

### Option B: Twilio WhatsApp API (Easier but Paid)

1. Sign up at https://www.twilio.com/
2. Navigate to WhatsApp Beta
3. Follow Twilio's setup wizard
4. Get Account SID and Auth Token
5. **Note**: If using Twilio, you'll need to modify the Python function to use Twilio's API

---

## Step 2: Deploy to Netlify

### 2.1 Prepare Your Repository

1. **Initialize Git (if not already done)**
   ```bash
   cd /Users/karthy/Desktop/ThaiMassageonHarvey.com.au
   git add .
   git commit -m "Add WhatsApp automation with Netlify functions"
   git push
   ```

### 2.2 Deploy to Netlify

1. **Sign up for Netlify**
   - Go to https://www.netlify.com/
   - Sign up with GitHub (recommended for easier deployment)

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize Netlify
   - Choose your repository: `ThaiMassageonHarvey.com.au`

3. **Configure Build Settings**
   - Build command: Leave empty (static site)
   - Publish directory: `.` (current directory)
   - Click "Deploy site"

4. **Wait for Deployment**
   - Netlify will deploy your site
   - You'll get a URL like: `https://random-name-123456.netlify.app`

---

## Step 3: Configure Environment Variables in Netlify

These are SECRET credentials - never commit them to GitHub!

1. **Go to Site Settings**
   - In Netlify dashboard, select your site
   - Click "Site settings" → "Environment variables"

2. **Add Variables**
   Click "Add a variable" for each of these:

   | Key | Value | Example |
   |-----|-------|---------|
   | `WHATSAPP_PHONE_NUMBER_ID` | Your Phone Number ID from Meta | `123456789012345` |
   | `WHATSAPP_ACCESS_TOKEN` | Your Access Token from Meta | `EAAABcd123...` |
   | `OWNER_PHONE` | Owner's phone (international format) | `61401818848` |

3. **Save and Redeploy**
   - After adding variables, go to "Deploys"
   - Click "Trigger deploy" → "Clear cache and deploy site"

---

## Step 4: Set Up Custom Domain (Optional)

1. **In Netlify Dashboard**
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Enter: `thaimassageonharvey.com.au`

2. **Update DNS Records**
   - Netlify will provide DNS records
   - Update your domain registrar with these records
   - Wait for DNS propagation (can take 24-48 hours)

---

## Step 5: Test the Booking System

1. **Visit Your Site**
   - Go to your Netlify URL or custom domain
   - Navigate to the booking form

2. **Submit a Test Booking**
   - Fill in all fields
   - Use a test phone number (that you have access to)
   - Click "Submit"

3. **Check for Messages**
   - Owner should receive WhatsApp message
   - Client should receive WhatsApp message
   - Both should receive email via web3forms

---

## Troubleshooting

### WhatsApp Messages Not Sending

**Check Netlify Function Logs:**
1. Go to Netlify Dashboard → Functions
2. Click on `send_whatsapp`
3. View logs to see error messages

**Common Issues:**
- ❌ **"WhatsApp API not configured"**
  - Solution: Check environment variables are set correctly in Netlify

- ❌ **"401 Unauthorized"**
  - Solution: Access token expired or invalid - regenerate in Meta dashboard

- ❌ **"403 Forbidden"**
  - Solution: Phone number not verified in WhatsApp Business API

- ❌ **Message only sent to owner, not client**
  - Solution: Check client phone number format (should be Australian mobile)

### Function Not Found (404)

- Check `netlify.toml` is in the root directory
- Redeploy the site
- Check Functions tab in Netlify to see if `send_whatsapp` appears

### CORS Errors

- Already configured in `netlify.toml`
- If still occurring, check browser console for specific error
- May need to clear cache and hard reload (Cmd+Shift+R)

---

## File Structure

```
ThaiMassageonHarvey.com.au/
├── tindex.html                          # Main website (updated with form handler)
├── netlify.toml                         # Netlify configuration
├── requirements.txt                     # Python dependencies
├── netlify/
│   └── functions/
│       └── send_whatsapp.py            # Serverless function
└── SETUP_INSTRUCTIONS.md               # This file
```

---

## Costs

### Free Tier Limits:
- **Netlify**: 125,000 function invocations/month (plenty for a booking site)
- **Meta WhatsApp Business API**: 1,000 free conversations/month
- **Web3Forms**: Unlimited (free tier)

### Paid Plans (if you exceed free tier):
- **Netlify**: $19/month for more bandwidth
- **Meta WhatsApp**: ~$0.005-0.01 per message after free tier
- **Twilio WhatsApp**: ~$0.005 per message

---

## Security Notes

- ✅ Environment variables are stored securely in Netlify (not in code)
- ✅ HTTPS is automatically enabled by Netlify
- ✅ CORS is properly configured
- ✅ Form validation prevents empty submissions
- ✅ Email backup ensures no bookings are lost

---

## Support

If you encounter issues:
1. Check Netlify function logs
2. Check Meta WhatsApp Business API dashboard
3. Test with your own phone number first
4. Verify all environment variables are set correctly

---

## Next Steps After Setup

1. Test thoroughly with different phone numbers
2. Monitor the first few bookings to ensure messages are delivered
3. Consider adding booking confirmation/cancellation features
4. Set up analytics to track booking conversions

---

**Questions?** Check the function logs in Netlify Dashboard → Functions → send_whatsapp

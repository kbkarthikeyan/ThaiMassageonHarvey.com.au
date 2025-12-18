# Quick Netlify Deployment Guide

## Your WhatsApp Credentials (Ready to Use)
- **Phone Number ID**: 972202825967474
- **Access Token**: EAAMAdS5OJo4BQGohBL2wDN4uDQBhP3ZAwVU22B4ZAtGjNlglmrR8oCtSZCD9Hk63ycg4tuDS1rix6ZCsjitZB8kB4TXcGsslglvToZArTsnKlZA44VW1f9YkciTGbNfKelnCPVkQArt4BEOVsmDSU0VZCAeuwAYy0dHOpXaMKmWhEMTgIcF3HgUEhi2ZCYmcFYIwXTDXyeNNfrSI8SvzJ94EbaHtpX7ZBfTxFd85TCr0TcbI0sq02fSqk7qIcH7XYZBFhmBG8aM1fUyh1panaDCP9V5
- **Owner Phone**: +39 349 556 5607

---

## Step 1: Push to GitHub

```bash
cd /Users/karthy/Desktop/ThaiMassageonHarvey.com.au
git add .
git commit -m "Add WhatsApp automation with Netlify"
git push
```

**⚠️ Important**: The `.env` file will NOT be pushed (protected by `.gitignore`)

---

## Step 2: Deploy to Netlify

1. **Go to Netlify**: https://app.netlify.com/
2. **Sign Up/Login**: Use your GitHub account
3. **Click**: "Add new site" → "Import an existing project"
4. **Select**: GitHub
5. **Authorize**: Netlify to access your GitHub
6. **Choose**: Your repository (ThaiMassageonHarvey.com.au)
7. **Deploy Settings**:
   - Build command: (leave empty)
   - Publish directory: `.`
8. **Click**: "Deploy site"

---

## Step 3: Add Environment Variables to Netlify

**CRITICAL**: These variables must be added in Netlify for WhatsApp to work.

1. **In Netlify Dashboard**:
   - Select your site
   - Click "Site configuration" → "Environment variables"

2. **Add these 3 variables**:

   Click "Add a variable" for each:

   **Variable 1:**
   - Key: `WHATSAPP_PHONE_NUMBER_ID`
   - Value: `972202825967474`

   **Variable 2:**
   - Key: `WHATSAPP_ACCESS_TOKEN`
   - Value: `EAAMAdS5OJo4BQGohBL2wDN4uDQBhP3ZAwVU22B4ZAtGjNlglmrR8oCtSZCD9Hk63ycg4tuDS1rix6ZCsjitZB8kB4TXcGsslglvToZArTsnKlZA44VW1f9YkciTGbNfKelnCPVkQArt4BEOVsmDSU0VZCAeuwAYy0dHOpXaMKmWhEMTgIcF3HgUEhi2ZCYmcFYIwXTDXyeNNfrSI8SvzJ94EbaHtpX7ZBfTxFd85TCr0TcbI0sq02fSqk7qIcH7XYZBFhmBG8aM1fUyh1panaDCP9V5`

   **Variable 3:**
   - Key: `OWNER_PHONE`
   - Value: `393495565607`

3. **Save** all variables

4. **Redeploy**:
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

---

## Step 4: Test Your Booking Form

1. **Get Your Netlify URL**:
   - You'll see it in the dashboard (e.g., `https://yoursite.netlify.app`)

2. **Visit the Booking Section**:
   - Navigate to `https://yoursite.netlify.app/#booking`

3. **Submit a Test Booking**:
   - Fill in all fields
   - Use YOUR phone number for testing
   - Click Submit

4. **Check for WhatsApp Messages**:
   - ✅ Owner (+39 349 556 5607) should receive booking alert
   - ✅ Client (your test number) should receive confirmation

---

## Step 5: Set Up Custom Domain (Optional)

1. **In Netlify**: Site settings → Domain management
2. **Add custom domain**: `thaimassageonharvey.com.au`
3. **Update DNS** at your domain registrar with Netlify's nameservers

---

## Troubleshooting

### No WhatsApp received?

**Check Function Logs:**
1. Netlify Dashboard → Functions
2. Click `send_whatsapp`
3. View real-time logs

**Common Issues:**

❌ **"Environment variables not set"**
- Solution: Make sure all 3 variables are added in Netlify

❌ **"Invalid phone number"**
- Solution: Use international format (no + sign, no spaces)
- Australian: `61412345678`
- Italian: `393495565607`

❌ **"Access token expired"**
- Solution: Regenerate token in Meta Developer Console

---

## What Happens When Someone Books?

1. **Client submits form** on website
2. **Netlify function runs** (Python backend)
3. **WhatsApp sent to Owner**: +39 349 556 5607
   - Contains: Client name, phone, email, service, date, time
4. **WhatsApp sent to Client**: Their phone number
   - Contains: Booking confirmation, details, location
5. **Email backup sent**: Via web3forms

---

## Next Steps

- ✅ Test with multiple phone numbers
- ✅ Monitor first few real bookings
- ✅ Set up custom domain
- ✅ Check Meta WhatsApp dashboard for message delivery stats

---

**Need Help?** Check function logs in Netlify or Meta Developer Console

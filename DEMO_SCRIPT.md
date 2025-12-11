# Investor Demo Script

## Pre-Demo Setup (5 minutes)

1. **Start the server:**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:4000`

2. **Start ngrok (in separate terminal):**
   ```bash
   ngrok http 4000
   ```
   Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

3. **Generate QR code with ngrok URL:**
   ```bash
   BASE_URL=https://abc123.ngrok.io npm run generate-qr
   ```

4. **Display QR code:**
   - Open `public/qr/SHARED1.png` on your computer screen
   - Or print it for physical demo

## Demo Flow (10-15 minutes)

### Introduction (1 minute)

> "Today I'm demonstrating QR Multiplex - a single QR code that intelligently routes users to different actions based on which app they use to scan it. The key innovation is automatic app detection and routing - the same QR code opens the right app with the right merchant details automatically. This is a non-transactional demo - all payment intents use ₹0 amount for safety."

### Scenario 1: Google Pay (2 minutes)

**Setup:**
- Have Google Pay app installed on demo phone
- Display QR code on screen

**Demo:**
> "Watch as I scan this QR code with Google Pay..."

1. Open Google Pay app
2. Tap "Scan QR" or use camera
3. Scan the displayed QR code

**Expected Result:**
- Google Pay opens automatically
- Merchant UPI ID is prefilled
- Amount shows as ₹0 (demo mode)
- No payment is actually processed

**Talking Points:**
- "Notice how Google Pay opened automatically - no manual selection needed"
- "The merchant's UPI ID is already prefilled: nad.nandagiri-3@okicici"
- "The amount is set to ₹0 for demo safety - in production, customers enter their amount"
- "This demonstrates automatic routing - the system detected Google Pay and opened it with the correct merchant details"

### Scenario 2: PhonePe (2 minutes)

**Demo:**
> "Now let's try the same QR with PhonePe..."

1. Open PhonePe app
2. Scan the same QR code

**Expected Result:**
- PhonePe opens with merchant UPI prefilled
- Amount shows as ₹0

**Talking Points:**
- "Same QR code, but PhonePe opened automatically this time"
- "Notice the automatic detection - the system knew it was PhonePe and routed accordingly"
- "The merchant UPI ID is prefilled automatically - seamless experience"
- "This is the power of intelligent routing - one QR, multiple apps, automatic detection"

### Scenario 3: Paytm (2 minutes)

**Demo:**
> "And with Paytm..."

1. Open Paytm app
2. Scan the same QR code

**Expected Result:**
- Paytm opens with merchant UPI prefilled

**Talking Points:**
- "Same QR code, Paytm opens automatically"
- "We support all major payment apps with automatic detection"
- "The routing is seamless - no user intervention needed"

### Scenario 4: Google Lens (2 minutes)

**Demo:**
> "When scanned with Google Lens, it routes to reviews..."

1. Open Google Lens
2. Point at QR code
3. Tap on the detected link

**Expected Result:**
- Browser opens Google Review page
- Place ID is correctly resolved
- User can leave a review

**Talking Points:**
- "Perfect for collecting customer feedback"
- "Automatically routes to the merchant's Google Review page"
- "No need for separate QR codes for reviews"

### Scenario 5: Camera/Browser - Full Experience (3-4 minutes)

**Demo:**
> "When scanned with a regular camera, users get the full experience..."

1. Open phone camera app (not a payment app)
2. Scan QR code
3. Browser opens landing page
4. Grant location permission when prompted

**Expected Result:**
- Landing page loads
- Requests browser geolocation
- After permission, shows:
  - Wi-Fi SSID and password
  - Review link button
  - Menu link button (if available)
  - Coupon link button (if available)
  - Demo payment buttons (Google Pay, PhonePe, Paytm)

**Talking Points:**
- "This is the full merchant experience"
- "Wi-Fi credentials for easy access"
- "All merchant services in one place"
- "Geolocation helps resolve the nearest merchant when multiple merchants share the same QR code"

**Interactive Demo:**
- Tap "Show Wi-Fi" - credentials are displayed
- Tap "Review on Google" - opens review page
- Tap "View Menu" - opens menu (if configured)
- Tap "Get Coupon" - opens coupon page (if configured)
- Tap payment buttons (Google Pay/PhonePe/Paytm) - opens respective payment apps with UPI prefilled

**Talking Points:**
- "From the landing page, users can also access payment apps"
- "When they tap a payment button, the app opens with merchant UPI prefilled"
- "This provides multiple entry points while maintaining the automatic routing"

### Scenario 6: Multiple Merchants (2 minutes)

**Demo:**
> "The same QR code supports multiple merchants..."

1. Open admin panel: `http://localhost:4000/admin` (or ngrok URL)
2. Show the 5 demo merchants
3. Explain geolocation-based resolution

**Talking Points:**
- "One QR code, five merchants"
- "System uses geolocation to find the nearest merchant"
- "If geolocation isn't available, uses IP-based fallback"
- "Perfect for franchises or multi-location businesses"

**Show Admin Panel:**
- "Merchants can be configured via this admin panel"
- "All data is stored in JSON for demo simplicity"
- "Production would use a database"

## Key Value Propositions (Closing - 2 minutes)

1. **Automatic Routing:** The core innovation - same QR code automatically opens the right app
2. **Zero User Friction:** No manual app selection - system detects and routes automatically
3. **Single QR Code:** One physical QR for all use cases and all payment apps
4. **App Detection:** Intelligent detection via HTTP headers (X-Requested-With, User-Agent)
5. **Geolocation Intelligence:** Nearest merchant resolution when multiple merchants share QR
6. **Context-Aware:** Different actions for different apps (Payments → UPI, Lens → Reviews, Camera → Landing)
7. **Production-Ready:** Logging, error handling, admin panel, scalable architecture

**Emphasize:** "The key differentiator is automatic routing. When an investor scans with Google Pay, Google Pay opens automatically with merchant details prefilled. No manual steps, no confusion - just seamless routing."

## Q&A Preparation

**Q: How does it detect which app scanned it?**
A: We inspect HTTP headers - specifically the `X-Requested-With` header for payment apps, and `User-Agent` patterns for others.

**Q: What if geolocation is denied?**
A: The system falls back to IP-based geolocation, or shows the first merchant if no location is available.

**Q: Is this scalable?**
A: Yes - the demo uses JSON for simplicity, but production would use a database. The architecture supports horizontal scaling.

**Q: Can merchants customize their actions?**
A: Yes - via the admin panel, merchants can configure UPI intents, Wi-Fi credentials, menu URLs, coupon URLs, and Google Place IDs.

**Q: What about security?**
A: All UPI intents use `am=0` (amount=0) for demo safety. Production would include authentication, rate limiting, and transaction validation.

**Q: How accurate is the geolocation?**
A: Browser geolocation is typically accurate to 10-50 meters. IP geolocation is less accurate (city-level) but serves as a fallback.

## Troubleshooting

**If Google Pay doesn't open:**
- Verify the UPI intent URL is correct
- Check that Google Pay app is installed
- Try scanning from within Google Pay app

**If location permission is denied:**
- Explain that the system will use IP geolocation as fallback
- Show that the landing page still works, just with less accurate merchant resolution

**If ngrok connection is slow:**
- Mention that production would use a proper domain and CDN
- This is just for demo purposes

## Demo Checklist

- [ ] Server running (`npm start`)
- [ ] ngrok running and URL copied
- [ ] QR code generated with ngrok URL
- [ ] QR code displayed on screen
- [ ] Google Pay app installed and tested
- [ ] PhonePe app installed and tested
- [ ] Paytm app installed and tested
- [ ] Google Lens accessible
- [ ] Phone camera ready
- [ ] Admin panel accessible
- [ ] All 5 merchants configured in `data/merchants.json`

---

**Total Demo Time: 15-20 minutes**

**Remember:** This is a demo - emphasize the concept, the intelligence, and the user experience. The technical details are impressive but secondary to the business value.




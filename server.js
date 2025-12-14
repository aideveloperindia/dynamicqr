const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Serve static files - MUST be before routes
// Handle static files explicitly for both local and Vercel
const publicPath = path.join(__dirname, 'public');

// Serve images with proper headers
app.use('/images', express.static(path.join(publicPath, 'images'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpeg') || filePath.endsWith('.jpg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
}));

app.use('/qr', express.static(path.join(publicPath, 'qr')));
app.use(express.static(publicPath));

// Debug route to check if files exist
app.get('/debug/images', (req, res) => {
  const fs = require('fs');
  const imagesPath = path.join(__dirname, 'public/images');
  try {
    const files = fs.readdirSync(imagesPath);
    res.json({ files, path: imagesPath });
  } catch (error) {
    res.json({ error: error.message, path: imagesPath });
  }
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Links configuration
const LINKS = {
  instagram: 'https://www.instagram.com/adx_transit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  payment: 'upi://pay?pa=starjay@ybl&pn=ADX%20Transit&am=0&cu=INR',
  whatsapp: 'https://wa.me/919912941214',
  website: 'https://www.adxtransit.com/',
  google: 'https://share.google/29IalFzkiMoJRpQlj'
};

// Main route - shows the icons page
app.get('/', (req, res) => {
  res.render('index', { links: LINKS });
});

// Redirect routes for each icon
app.get('/instagram', (req, res) => {
  res.redirect(LINKS.instagram);
});

app.get('/payment', (req, res) => {
  res.redirect(LINKS.payment);
});

app.get('/whatsapp', (req, res) => {
  res.redirect(LINKS.whatsapp);
});

app.get('/website', (req, res) => {
  res.redirect(LINKS.website);
});

app.get('/google', (req, res) => {
  res.redirect(LINKS.google);
});

// For local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;

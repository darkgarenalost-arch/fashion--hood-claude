# Fashion Hood Setup Guide

This project is a static ecommerce site. It uses HTML, Tailwind CDN utilities, custom CSS, JavaScript modules, Firebase Auth, Firestore, Firebase Storage and Razorpay Checkout. There is no Node server.

## 1. Firebase project

1. Create a Firebase project.
2. Add a Web App.
3. Copy the web app config into `firebase/firebase-config.js`.
4. Enable Authentication with Email/Password.
5. Create your admin user in Firebase Authentication.
6. Copy that user's UID.
7. In Firestore, create `admins/{UID}` with:

```json
{
  "email": "your@email.com",
  "role": "owner"
}
```

8. Also paste the same UID into `brandConfig.adminUids` in `firebase/firebase-config.js` for the dashboard guard.

## 2. Firestore and Storage rules

Paste these files into Firebase Console:

- `firebase/firestore.rules`
- `firebase/storage.rules`

Products, banners, coupons and branding are public read/admin write. Orders can be created by checkout and managed by admins.

## 3. Add products

1. Open `admin/login.html`.
2. Login with your Firebase Auth admin account.
3. Open Products.
4. Click Add product.
5. Fill name, category, price, sale price, stock, sizes, colors and tags.
6. Upload multiple images or paste image URLs.
7. Add tags such as `new-arrival`, `best-seller` and `featured`.
8. Save. The product appears on the storefront immediately.

## 4. Manage orders

Orders are stored in Firestore under `orders`.

The dashboard shows customer name, address, phone, WhatsApp number, ordered items, payment method, order status, date and total. Use the status dropdown to move orders through Placed, Confirmed, Packed, Shipped, Delivered or Cancelled.

## 5. Coupons

Create coupons from the Coupons tab.

- Percent coupon: `type = percent`, `value = 10`
- Flat coupon: `type = flat`, `value = 200`
- Disable coupons by unchecking Enabled.

## 6. Homepage banners

Open Banners in admin. Upload a banner image, set title, subtitle, CTA, link and position. Active banners rotate in the hero.

## 7. Logo and favicon

Open Logo & Favicon in admin. Upload image files. The URLs are saved to `settings/site` and applied by storefront pages.

## 8. Razorpay

1. Create a Razorpay account.
2. Copy your test key ID.
3. Paste it into `brandConfig.razorpayKeyId` in `firebase/firebase-config.js`.
4. Test online payments from `checkout.html`.

Important production note: A static-only Razorpay flow can collect a payment ID in the browser, but cryptographic signature verification needs a trusted server or Firebase Cloud Function. COD is production-ready with Firestore. For online payments, enable Razorpay webhooks or a Firebase Cloud Function before going live with real money.

## 9. Deploy on Netlify

1. Use `fashion-hood` as the publish directory.
2. No build command is required.
3. Add your custom domain.
4. Update `robots.txt` and `sitemap.xml` with the real domain.

## 10. Deploy on Vercel

1. Import the repository.
2. Set the project root to `fashion-hood`.
3. Use Other/static output.
4. No build command is required.
5. Update `robots.txt` and `sitemap.xml` with the real domain.


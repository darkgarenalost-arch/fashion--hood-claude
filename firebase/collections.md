# Firebase Collections

## admins

Create one document where the document ID is your Firebase Auth user UID.

```json
{
  "email": "owner@example.com",
  "role": "owner",
  "createdAt": "manual"
}
```

## products

```json
{
  "name": "Scarlet Muse Straight Kurti",
  "slug": "scarlet-muse-straight-kurti",
  "category": "kurtis",
  "tags": ["new-arrival", "best-seller", "featured"],
  "featured": true,
  "price": 1799,
  "salePrice": 1299,
  "stock": 32,
  "sizes": ["XS", "S", "M", "L", "XL"],
  "colors": ["Red", "Black"],
  "images": ["https://..."],
  "description": "Premium product copy.",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

## orders

Orders are created by checkout and viewed in admin.

```json
{
  "customer": {
    "name": "Customer Name",
    "phone": "9999999999",
    "whatsapp": "9999999999",
    "email": "customer@example.com",
    "address": "Full address",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "items": [],
  "paymentMethod": "COD",
  "paymentStatus": "Pending COD",
  "status": "Placed",
  "total": 1299
}
```

## coupons

```json
{
  "code": "FHLOVE",
  "type": "percent",
  "value": 10,
  "minCart": 999,
  "active": true
}
```

## banners

```json
{
  "title": "New Season, Main Character Energy",
  "eyebrow": "Fresh drops",
  "subtitle": "Homepage banner copy.",
  "image": "https://...",
  "cta": "Shop now",
  "link": "products/",
  "position": 1,
  "active": true
}
```

## settings/site

```json
{
  "logoUrl": "https://firebasestorage.googleapis.com/...",
  "faviconUrl": "https://firebasestorage.googleapis.com/..."
}
```


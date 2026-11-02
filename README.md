# Southside Customs Website

Site for OG & NOS Chevrolet parts, Zenith Dayton wheels, knock-off restorations, customs, and hydraulics.

## Deploy on Render

1. Create a new GitHub repo (e.g. `southsidecustoms`)
2. Push this folder
3. On Render: New Web Service → connect the repo
4. Build command: `npm install`
5. Start command: `npm start`

## Update Products from Termux (Cloudinary links)

1. Edit `public/products.json` (or replace the whole file)
2. Use real Cloudinary image URLs
3. Commit and push:

```bash
cd ~/southsidecustoms
nano public/products.json
# edit or paste new products
git add public/products.json
git commit -m "Update products"
git push
```

Render will redeploy automatically and the new images + prices will appear.

## Product JSON format

```json
{
  "id": "21",
  "name": "Part Name",
  "price": 99,
  "currency": "USD",
  "image": "https://res.cloudinary.com/your-cloud/image/upload/....jpg",
  "description": "Full description shown when tapped",
  "category": "Door Guards",
  "condition": "NOS",
  "type": "part",
  "fits": "1958 Chevrolet Impala sedan",
  "includes": "Set of 6",
  "details": ["Short bullet 1", "Short bullet 2"]
}
```

Notes:
- `type` is `part` or `service`. For services, add `"priceNote": "Starting price"` so the price shows as "From $X".
- All prices are USD. Payment and shipping wording lives in the "Payment & Currency" section of `public/index.html`.

Contact: southsidecustomsaccessorieshop@gmail.com

## Site structure

- `public/index.html`: home, shop grid, catalog, services, payment, about
- `public/product.html?id=ID`: full description page for one part
- `public/contact.html`: contact form that sends email to the address above
- `public/products.json`: all parts. Set `"image"` to a Cloudinary photo URL; until then each part shows a label card.
- `"layout"` controls how a part appears in the shop grid: `card` (column), `tall` (tall column), `wide` (row) or `banner` (full-width row)
- Logo and catalog image links are set in `public/index.html` (search for `res.cloudinary.com/dtdohzvu`)

## Contact form

The form sends through FormSubmit. The first message sent after you deploy triggers an activation email to the address above. Open it and confirm once, and all later messages arrive in your inbox.

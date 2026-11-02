# Southside Customs Website

Premium site for OG & NOS Chevrolet parts, Zenith Dayton wheels, knock-off restorations, customs, and hydraulics.

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
  "condition": "NOS"
}
```

Contact: southsidecustomsaccessorieshop@gmail.com

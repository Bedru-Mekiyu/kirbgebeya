# Live Production vs Codebase Comparative Assessment — Kirb Gebeya

## 1. Overview & Verification Method

- **Live Production URL**: `https://kirbgebeya.com/`
- **Hosting Environment**: LiteSpeed Web Server, cPanel managed, SSL enabled.
- **Repository Reference**: Commit `5f09b6a` on branch `main`.
- **Methodology**: Non-intrusive HTTP inspection, Headless Chrome screenshot comparison, HTML DOM parsing, and SSL certificate verification.

---

## 2. 16-Area Comparative Matrix

| # | Functional Area | Repository State (`5f09b6a`) | Live Production (`kirbgebeya.com`) | Finding & Divergence Analysis | Status |
|---|---|---|---|---|---|
| 1 | **Homepage Layout** | `classic` theme with left category drawer & hero slider. | `classic` theme with left category drawer & hero slider. | **Identical**. Both render the classic Active eCommerce template. | Match |
| 2 | **Header Topbar** | English, ETB currency, Become a Seller, Helpline `+251974967171`. | English, ETB currency, Become a Seller, Helpline `+251974967171`. | **Identical**. Contact helpline and default currency match. | Match |
| 3 | **Header Navigation** | Menu links: `/`, `/track-your-order`, `/shops/create`, `/affiliate`. | Menu links: `/`, `/track-your-order`, `/shops/create`, `/affiliate`. | **Identical**. Navigation menu labels and links match. | Match |
| 4 | **Product Catalog** | Local database contains 0 demo products (clean seed). | Contains live product inventory with real images & prices. | **Expected Divergence**. Production has real marketplace data. | Content Diff |
| 5 | **Categories** | Local database had 3 demo categories (`Demo category 1-3`). | 10+ live Ethiopian categories (e.g., `HOME CARE AND CLEANING`, `JUICES`, `COFFEE AND TEA`, `COOKING OIL`). | **Expected Divergence**. Production has active merchant category structure. | Content Diff |
| 6 | **Search** | Dynamic AJAX autocomplete on `/search/ajax`. | Dynamic AJAX autocomplete on `/search/ajax`. | **Identical**. Both execute substring searches. | Match |
| 7 | **Shopping Cart** | Cart dropdown & modal with `Br0.00 (0 Items)`. | Cart dropdown & modal with `Br0.00 (0 Items)`. | **Identical**. Both calculate in Ethiopian Birr (`Br`). | Match |
| 8 | **Checkout Funnel** | Multi-step checkout (`/checkout`). | Multi-step checkout (`/checkout`). | **Identical**. Both route through shipping & delivery steps. | Match |
| 9 | **Authentication** | Local login routes (`/users/login`, `/seller/login`). | Local login routes (`/users/login`, `/seller/login`). | **Identical**. Both present branded login screens. | Match |
| 10 | **Customer Dashboard** | Standard customer dashboard wrapper (`/dashboard`). | Standard customer dashboard wrapper (`/dashboard`). | **Identical**. Profile and order history views match. | Match |
| 11 | **Seller Portal** | Seller registration (`/shops/create`) & login. | Seller registration (`/shops/create`) & login. | **Identical**. Onboarding workflow matches. | Match |
| 12 | **Affiliate System** | Full affiliate add-on schema imported; `/affiliate` returns 200. | `/affiliate` returns `HTTP 200 OK`. | **Identical**. Both accept partner affiliate applications. | Match |
| 13 | **Currency Handling** | Default currency: Ethiopian Birr (`ETB`, `Br`). | Default currency: Ethiopian Birr (`ETB`, `Br`). | **Identical**. Both default to ETB. | Match |
| 14 | **Localization** | Languages: English, Bangla, Arabic (Missing Amharic). | Languages: English, Bangla, Arabic (Missing Amharic). | **Identical Defect**. Amharic is missing on both. | Defect Match |
| 15 | **Footer & Policies** | Guarded email `mailto:` and clean `/privacy-policy` link. | Cookie alert STILL links to `https://demo.activeitzone.com/ecommerce/privacypolicy`. | **CRITICAL PRODUCTION DIVERGENCE**. Repository fix has NOT been run on production DB! | **Desynchronized** |
| 16 | **Mobile Interface** | Mobile navigation bottom bar & hamburger drawer. | Mobile navigation bottom bar & hamburger drawer. | **Identical**. Mobile layout rendering matches. | Match |

---

## 3. Production Synchronization Audit: Has Commit `5f09b6a` Landed?

### The Proof of Database Desynchronization
During our live DOM inspection of `https://kirbgebeya.com/`:
```html
<!-- Live Production HTML from kirbgebeya.com -->
<div class="aiz-cookie-alert">
    <p>We use cookie for better user experience, check our policy 
       <a href="https://demo.activeitzone.com/ecommerce/privacypolicy">here</a>&nbsp;
    </p>
</div>
```
In commit `5f09b6a`, we updated `public_html/shop.sql` and the local MariaDB database `custom_alerts` row 1:
```sql
UPDATE custom_alerts SET description = '<p>We use cookie for better user experience, check our policy <a href="/privacy-policy">here</a>&nbsp;</p>' WHERE id = 1;
```

### Conclusion
**The repository changes have been pushed to GitHub, but the production database in cPanel has NOT been updated.**  
Because `custom_alerts` data is stored in the database (not in static Blade files), pushing to Git does not update the live site's database table. An administrator must execute the update query directly against the production MariaDB database or via the admin panel.

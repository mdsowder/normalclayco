# Normal Clay Co.

A small-shop website for **Normal Clay Co.**, my sister's handmade ceramics business, designed and built for a UX/UI research and design course at the University of Chicago (2025).

**Live site:** https://mdsowder.github.io/normalclayco/

![Normal Clay Co. home page](demo_ss/Screenshot%202025-12-09%20at%204.35.46%E2%80%AFPM.png)

## What it does

- **Shop and product pages** generated from a single product data file (`js/products.js`), so the owner can add or edit items (price, stock, size, care notes) without touching the layout
- **Basket** that persists between visits using `localStorage`, with quantity controls and a live item count in the header
- **Checkout flow** that lets shoppers continue as a guest, sign in, or create an account, and choose local pickup or shipping
- **About and contact pages** that introduce the maker and let customers send a message
- **Responsive layout** for phone and desktop

## Built with

HTML, CSS, and vanilla JavaScript. No frameworks. Hosted on GitHub Pages.

## Project structure

```
index.html      Home page
shop.html       Product grid
product.html    Product detail
basket.html     Basket and checkout
about.html      About the maker
contact.html    Contact form
css/styles.css  Styles
js/products.js  Product catalog (edit this to change products)
js/main.js      Basket, rendering, checkout, and form logic
```

## Note

This is a class project and a design prototype. Checkout and the contact form are front-end demos and don't process real orders or send messages.

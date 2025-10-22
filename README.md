## Table of Contents

- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Run Development Server](#run-development-server)
  - [Build for Production](#build-for-production)
  - [Notes](#notes)
- [Customization](#customization)
- [Payment Flow](#payment-flow)
  - [Select Token Page](#select-token-page)
  - [Gateway Page](#gateway-page)
  - [Status Page](#status-page)
  - [Store (Pinia)](#store-pinia)
  - [Notes](#notes-1)

---

## Quick Start

This project is a **Vue.js-based payment gateway page** used in the EasyBitPay system.  
It allows merchants to display a custom payment interface for their customers.

---

### Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js:** v18.x (LTS version recommended)  
- **npm:** Installed globally (ships with Node.js)

You can verify installation with:

```bash
node -v
npm -v
```

---

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/easybitpay/pay
npm install
```

---

### Environment Configuration

The project uses a `.env.development` file for local configuration.  
Create this file in the project root if it doesn't exist:

```bash
cp .env .env.development
```

Then, set the required variables such as API URLs and public keys.

Example:

```env
VITE_APP_STORAGE_URL=https://panel.easybitpay.com
VITE_APP_BASE_URL=https://panel.easybitpay.com/api
VITE_APP_SANDBOX_URL=https://panel.easybitpay.com/api-sandbox
```

---

### Run Development Server

Start the local dev server with:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

---

### Build for Production

To create an optimized production build:

```bash
npm run build
```

The compiled files will be generated in the `/dist` directory.

---

### Notes

- This page directly handles **payment interactions**, so no demo or mock data is provided.  
- Recommended Node.js version: **18.x**

---

## Customization

This project is designed so that developers can customize the look and feel of the payment page after cloning the repository. The main locations for files that can be modified are:

- **Images and Logos:** `/public/media`  
  Place or replace logo files and other static images here.

- **Styles and SCSS:** `/src/styles/scss`  
  Modify SCSS files to change colors, fonts, and general styling.

- **Composables:** `/src/composables`  
  Add or modify reusable Vue 3 hooks and shared logic.

- **Components:** `/src/components`  
  Modify or extend Vue components to customize form layout, buttons, and interactions.

- **Layout:** `/src/layouts`  
  Customize page layouts, wrappers, and general structure of pages.

- **Vuex Store:** `/src/store`  
  Manage global state, payment data, and settings.

- **Router:** `/src/router`  
  Modify routes and page navigation.

---

## Payment Flow

This project uses a structured payment flow with three main pages: **Select Token**, **Gateway**, and **Status**.

### Select Token Page (`/pay/invoice/:id` or `/pay-sandbox/invoice/:id`)

- Displays customer info and invoice items.  
- User selects a **Coin** and a **Network**.  
- Optional inputs: Name, Email, Amount (based on app settings).  
- Selections are stored in the `pay` store (`selectedCoin`, `selectedNetwork`).  
- On valid form submission, navigates to the Gateway page.

### Gateway Page (`/pay/gateway/:id`)

- Shows selected Coin, Network, remaining amount, and QR code.  
- Polls API every 30 seconds to update payment status.  
- Supports **sandbox mode** for fake payments.  
- Users can cancel the payment.  
- Transactions are displayed in real-time from the store.

### Status Page (`/pay/status/:id`)

- Displays payment status: Expired, Canceled, Completed.  
- Shows transaction history.  
- Countdown timer before redirecting to merchant site.  
- Uses `useRedirectPayment` composable to handle:  
  - Redirect to merchant (`redirect`)  
  - Cancel payment (`cancelPayment`)  
  - Status code to text/color (`convertCodeToStatus`, `convertCodeToColor`)

### Store (`pay` Pinia Store)

Manages:

- `invoiceCode`, `invoiceDetail`, `paymentDetail`  
- `selectedCoin`, `selectedNetwork`  
- `userInputs`, `paymentTransactions`  
- Loading states and helpers to refresh or fake payments  

### Notes

- Selections persist in **localStorage**.  
- Sandbox mode allows testing without real transactions.  
- API endpoints:

  - `GET /invoices/:invoiceCode` → fetch invoice details  
  - `GET /wallet/:invoiceID` or `POST /wallet/:invoiceID` → payment info  
  - `GET /invoices/status/:invoiceCode` → check payment status  
  - `GET /invoices/cancel/:invoiceCode` → cancel payment  
  - `GET /invoices/pay-fake/:invoiceCode/:tokenId/:amount` → fake payment (sandbox)

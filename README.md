# Sainik Bhojnalaya Desktop Item Control

A Windows desktop client for the Sainik Bhojnalaya WooCommerce Availability Suite.

## Requirements
- Windows 10/11
- The combined WooCommerce plugin installed on the website
- A WordPress/WooCommerce account with `manage_woocommerce`
- HTTPS on the website

## Development
Install Node.js, then in this folder:
`npm install`
`npm start`

To build a Windows installer:
`npm run build`

The output will be in `dist/`.

## First run
Open Settings and enter:
- WooCommerce site URL, e.g. https://example.com
- WordPress username
- Application password

For production, replace direct credential storage with a secure token/backend authentication mechanism.

## App behavior
- ON = orderable
- SOLD OUT = visible but not orderable
- OFF = hidden/not orderable
- Availability does not change stock quantity.

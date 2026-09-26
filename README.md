# North Star Bakery — Touchstone 4

Interactive website for **North Star Bakery**, a fictional neighborhood
bakery. This is the Touchstone 4 project for Sophia Learning's
*Introduction to Web Development* course (student: Imran Yasin).

It continues the website built for Touchstone Task 2 and Touchstone 3,
adding client-side interactivity with plain HTML, CSS, and vanilla
JavaScript (no frameworks, no backend).

## Pages

- `index.html` — welcome, hours, featured item, audio welcome message
- `products.html` — breads, pastries, cakes, signature loaf, and the
  **Pre-Order Planner**
- `about.html` — bakery story, sourcing, staff, behind-the-scenes video
- `contact.html` — inquiry/pre-order form with JavaScript validation

## Touchstone 4 features

### Pre-Order Planner (`products.html` + `script.js`)

- Each product has an **Add to Pre-Order List** button.
- Selected items appear immediately in the "Your Pre-Order List" panel
  with a live item count.
- Duplicate selections are prevented; items can be removed individually
  or cleared all at once.
- The list is saved to `localStorage` under the key
  `northStarSelectedProducts` and restored after a page reload.

### Form validation (`contact.html` + `script.js`)

- JavaScript validates name, email, request type, pickup date
  (today or later, required for pre-orders), and order details.
- Invalid submission is prevented, errors appear next to each field
  (`aria-invalid`, `aria-describedby`, live regions), and entered data
  is preserved.

### Saved items flow into the contact form

- Selected products are pre-filled into the Item/order details field on
  `contact.html` when that field is empty, so saved selections support
  the pre-order inquiry.

## Run locally

Open any page directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

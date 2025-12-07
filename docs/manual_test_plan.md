# Seller System - Manual Test Plan

This document outlines the manual testing steps to verify the functionality of the newly implemented Seller System and recent updates.

## Prerequisites
1.  Ensure the development server is running: `npm run dev`
2.  Open your browser to `http://localhost:3000`
3.  Ensure you have a registered user account (or create one).

## Test Scenarios

### 1. Seller Registration
*   **Goal**: Verify a user can register as a seller.
*   **Steps**:
    1.  Log in with a user account that is *not* yet a seller.
    2.  Navigate to `/seller`.
    3.  **Expected**: Redirects to `/seller/register`.
    4.  Fill in Shop Name, Description, Address details.
    5.  Click **"ลงทะเบียนร้านค้า"**.
    6.  **Expected**: Success message, redirects to `/seller` (Dashboard).

### 2. Dashboard & Product Creation
*   **Goal**: Create a product and view dashboard.
*   **Steps**:
    1.  On `/seller`, click **"เพิ่มสินค้าใหม่"** (Add Product).
    2.  Fill form: Title, Price, upload 2-3 images.
    3.  Click **"ลงขายทันที"**.
    4.  **Expected**: Redirects/Clears form.
    5.  Go to your shop page `/shop/[your-shop-slug]` to see the product.

### 3. **NEW: Product Image Management**
*   **Goal**: Verify product owner can delete images.
*   **Steps**:
    1.  Go to the product page of a product *you created* (e.g., `/product/[slug]`).
    2.  Look at the thumbnail strip below the main image.
    3.  **Expected**: You should see a small red **"X"** button on the top-right of each thumbnail (only visible to you, the owner).
    4.  **Action**: Click the "X" on one image. Confirm the dialog.
    5.  **Expected**: The image is removed from the view and the database immediately.

### 4. **NEW: User Profile Editing**
*   **Goal**: specific user profile editing.
*   **Steps**:
    1.  Navigate to `/profile` (your personal profile).
    2.  Click the **"ตั้งค่าโปรไฟล์"** (Settings) or **"Edit"** (Pencil icon) button.
    3.  **Expected**: The name field becomes editable.
    4.  Change your Display Name.
    5.  Click **"บันทึก"** (Save).
    6.  **Expected**: Success alert, and the name updates on the screen.

### 5. **NEW: Public Profile Routing**
*   **Goal**: Verify profile redirection.
*   **Steps**:
    1.  Click on any seller's name in a product card or detail page.
    2.  This goes to `/profile/[user-id]`.
    3.  **Expected**:
        *   If the user **is a seller**: Redirects immediately to `/shop/[shop-slug]`.
        *   If the user **is NOT a seller**: Shows a simple page listing their products (if any).

## Troubleshooting
*   **Images not deleting?**: Check console for permission errors (Rules).
*   **Name not saving?**: Ensure Firebase Auth is initialized correctly.

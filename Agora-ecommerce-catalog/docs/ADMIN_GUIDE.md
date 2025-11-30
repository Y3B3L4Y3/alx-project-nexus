# Admin Panel User Guide

A complete guide to managing your AGORA e-commerce store through the admin panel.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Dashboard](#dashboard)
- [Managing Products](#managing-products)
- [Managing Orders](#managing-orders)
- [Managing Users](#managing-users)
- [Managing Categories](#managing-categories)
- [Messages](#messages)
- [Settings](#settings)
- [User Roles](#user-roles)

---

## Getting Started

### Accessing the Admin Panel

1. Navigate to `/admin/login` on your website
2. Enter your admin email and password
3. Click "Sign In"

### Admin Panel Layout

The admin panel has these main sections:

| Section | Icon | Description |
|---------|------|-------------|
| Dashboard | Home | Overview and statistics |
| Products | Box | Manage product catalog |
| Orders | Clipboard | View and manage orders |
| Users | People | Manage customer accounts |
| Categories | Folder | Organize products |
| Messages | Mail | Customer inquiries |
| Settings | Gear | Store configuration |

---

## Dashboard

The dashboard shows you key metrics at a glance:

### Statistics Cards

- **Total Sales** - Revenue from all completed orders
- **Total Orders** - Number of orders placed
- **Total Users** - Registered customer accounts
- **Pending Orders** - Orders waiting to be processed

### Quick Actions

From the dashboard, you can:
- View recent orders
- See new customer registrations
- Check low stock products
- View unread messages

---

## Managing Products

### Viewing Products

1. Click **Products** in the sidebar
2. Use the search bar to find specific products
3. Filter by category, status, or stock level
4. Sort by name, price, or date

### Adding a New Product

1. Click the **Add Product** button
2. Fill in the product details:

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Product name (max 255 chars) |
| Description | Yes | Detailed product description |
| Price | Yes | Current selling price |
| Original Price | No | Original price (for showing discounts) |
| Stock | Yes | Available quantity |
| Category | Yes | Product category |
| Brand | No | Brand name |
| Thumbnail | Yes | Main product image |

3. Add additional options:

| Field | Description |
|-------|-------------|
| Colors | Available color options (comma-separated) |
| Sizes | Available sizes (e.g., S, M, L, XL) |
| Tags | Keywords for search (comma-separated) |

4. Set product badges:
   - **New** - Shows "NEW" badge
   - **Featured** - Shows on homepage

5. Click **Save Product**

### Uploading Product Images

1. Click **Choose Files** or drag and drop images
2. Upload up to 10 images per product
3. The first image becomes the thumbnail
4. Supported formats: JPEG, PNG, GIF, WebP
5. Maximum file size: 5MB per image

### Editing a Product

1. Find the product in the list
2. Click the **Edit** button (pencil icon)
3. Modify the details
4. Click **Save Changes**

### Deleting a Product

1. Find the product in the list
2. Click the **Delete** button (trash icon)
3. Confirm the deletion

**Note:** Deleted products are "soft deleted" - they're hidden but data is preserved.

---

## Managing Orders

### Order Statuses

| Status | Color | Description |
|--------|-------|-------------|
| Pending | Yellow | Order received, awaiting processing |
| Processing | Blue | Order is being prepared |
| Shipped | Purple | Order has been shipped |
| Delivered | Green | Order delivered to customer |
| Cancelled | Red | Order was cancelled |

### Viewing Orders

1. Click **Orders** in the sidebar
2. Filter by status using the tabs
3. Search by order ID or customer name
4. Click an order to view details

### Order Details Page

Shows:
- Customer information
- Shipping address
- Order items with quantities
- Payment status
- Order totals

### Updating Order Status

1. Open the order details
2. Click the **Update Status** dropdown
3. Select the new status:
   - Pending → Processing
   - Processing → Shipped
   - Shipped → Delivered
4. Status changes are saved automatically

### Adding Tracking Information

1. Open the order details
2. Find the **Tracking** section
3. Enter the tracking number
4. Add estimated delivery date
5. Click **Save**

The customer can view this in their order history.

---

## Managing Users

### Viewing Users

1. Click **Users** in the sidebar
2. Search by name or email
3. Filter by role or status

### User Information

Each user shows:
- Name and email
- Registration date
- Role (customer, admin, etc.)
- Status (active, suspended)
- Order count

### Changing User Role

1. Click **Edit** on the user
2. Select new role from dropdown:
   - Customer
   - Viewer
   - Editor
   - Moderator
   - Admin
   - Super Admin
3. Click **Save**

### Suspending a User

1. Find the user
2. Click **Suspend** button
3. User cannot log in while suspended

### Activating a User

1. Find the suspended user
2. Click **Activate** button
3. User can log in again

### Resetting User Password

1. Click **Reset Password** on the user
2. Enter new password (min 8 characters)
3. Confirm password
4. Click **Reset**

**Note:** This immediately changes the password. Inform the user of their new password.

---

## Managing Categories

### Viewing Categories

1. Click **Categories** in the sidebar
2. See all categories with product counts

### Adding a Category

1. Click **Add Category**
2. Enter category name
3. Add URL slug (auto-generated from name)
4. Upload category icon/image (optional)
5. Click **Save**

### Editing a Category

1. Click **Edit** on the category
2. Modify name, slug, or image
3. Click **Save**

### Deleting a Category

1. Click **Delete** on the category
2. Confirm deletion

**Warning:** Deleting a category will unassign products from it.

---

## Messages

### Viewing Messages

1. Click **Messages** in the sidebar
2. Unread messages appear bold
3. Filter by status: New, Read, Replied

### Message Statuses

| Status | Description |
|--------|-------------|
| New | Unread message |
| Read | Message has been viewed |
| Replied | Response has been sent |

### Responding to Messages

1. Click on a message to open it
2. Read the customer's inquiry
3. Click **Reply** to send email response
4. Click **Mark as Replied** when done

### Deleting Messages

1. Click **Delete** on the message
2. Confirm deletion

---

## Settings

### Store Settings

- **Store Name** - Your business name
- **Store Email** - Contact email
- **Store Phone** - Contact phone
- **Store Address** - Physical address

### Tax Settings

- **Tax Rate** - Default tax percentage
- **Tax Included** - Whether prices include tax

### Shipping Settings

- **Free Shipping Threshold** - Minimum order for free shipping
- **Default Shipping Cost** - Standard shipping price

### Notification Settings

- **Order Notifications** - Email on new orders
- **Low Stock Alerts** - Email when stock is low
- **New User Notifications** - Email on registrations

---

## User Roles

### Role Permissions

| Permission | Super Admin | Admin | Moderator | Editor | Viewer |
|------------|-------------|-------|-----------|--------|--------|
| View Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage Products | ✓ | ✓ | ✓ | ✓ | ✗ |
| Delete Products | ✓ | ✓ | ✓ | ✗ | ✗ |
| Manage Orders | ✓ | ✓ | ✓ | ✗ | ✗ |
| View Users | ✓ | ✓ | ✓ | ✗ | ✗ |
| Manage Users | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage Admins | ✓ | ✗ | ✗ | ✗ | ✗ |
| Manage Settings | ✓ | ✓ | ✗ | ✗ | ✗ |
| Delete Data | ✓ | ✓ | ✗ | ✗ | ✗ |

### Role Descriptions

**Super Admin**
- Full access to everything
- Can manage other admins
- Cannot be deleted

**Admin**
- Full access except managing other admins
- Can create moderators and editors

**Moderator**
- Manage products and orders
- View (but not edit) users
- Cannot access settings

**Editor**
- Create and edit products only
- Cannot delete anything
- Cannot manage users or orders

**Viewer**
- Read-only access
- Can view dashboard and products
- Cannot make any changes

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus search |
| `Esc` | Close modal |
| `Enter` | Submit form |

---

## Tips & Best Practices

### Products

1. **Use clear images** - High-quality photos sell products
2. **Write detailed descriptions** - Help customers decide
3. **Keep stock updated** - Avoid overselling
4. **Use tags** - Improve search results

### Orders

1. **Process quickly** - Ship within 24-48 hours
2. **Add tracking** - Customers love tracking updates
3. **Communicate** - Update status regularly

### Users

1. **Respond to messages** - Quick responses build trust
2. **Handle issues fairly** - Good service = returning customers
3. **Don't share passwords** - Always use reset function

---

## Troubleshooting

### "Access Denied"

- Your role may not have permission
- Contact a Super Admin

### "Product save failed"

- Check all required fields are filled
- Ensure image is under 5MB
- Check category is selected

### "Cannot delete"

- Item may be in use (e.g., product in orders)
- Your role may not have delete permission

### Need Help?

Contact your system administrator or refer to the technical documentation.


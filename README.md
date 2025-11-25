
# **🛒Agora: E-Commerce Product Catalog **


A fully responsive, scalable, and performance-optimized **E-Commerce Product Catalog** built using **React, TypeScript, Redux Toolkit, and RTK Query**.
This project showcases real-world front-end engineering skills including component architecture, API integration, global state management, reusable UI patterns, debounced search, product filtering, and a functional cart system . and the name 'Agora' The Greek word agora means "an assembly of the people," from a root meaning "to gather." Definitions of agora. noun. the marketplace in ancient Greece..

---

## **🚀 Features**

### **🔎 Dynamic Product Catalog**

* Fetch products from API using **RTK Query**
* Live filtering (category, price, rating)
* Debounced search for performance
* Sort by popularity or price

### **🛍️ Product Details Page**

* View full product information
* High-quality image gallery
* Add to cart with quantity selection

### **🛒 Shopping Cart**

* Add / Remove items
* Update quantities
* Auto-calculate subtotal and grand total
* Persistent cart (Redux + localStorage)

### **📱 Fully Responsive**

Built with **Tailwind CSS** to ensure a perfect experience on:

* Mobile
* Tablet
* Desktop

### **⚡ Modern Frontend Stack**

* **React + TypeScript**
* **Redux Toolkit** (cart + product state)
* **RTK Query** (API requests, caching, data normalization)
* **Custom Hooks** (`useDebounce`)
* **Reusable UI components**

---

# **📂 Project Structure**

```
ecommerce-catalog/
├─ public/
│  └─ assets/              <-- Static images
├─ src/
│  ├─ api/
│  │  └─ apiSlice.ts       <-- If using RTK Query (Recommended over axios directly)
│  ├─ components/          <-- REUSABLE components (used in multiple places)
│  │  ├─ common/           <-- Buttons, Inputs, Spinners
│  │  │  ├─ Button.tsx
│  │  │  └─ LoadingSpinner.tsx
│  │  ├─ layout/           <-- Navbar, Footer
│  │  │  ├─ Header.tsx
│  │  │  └─ Footer.tsx
│  │  └─ product/          <-- Product specific components
│  │     ├─ ProductCard.tsx
│  │     └─ FilterBar.tsx
│  ├─ hooks/               <-- Custom hooks
│  │  └─ useDebounce.ts
│  ├─ pages/
│  │  ├─ Home.tsx
│  │  ├─ ProductDetail.tsx
│  │  └─ Cart.tsx          <-- Don't forget the Cart page!
│  ├─ redux/
│  │  ├─ store.ts
│  │  ├─ slices/
│  │  │  ├─ productSlice.ts
│  │  │  └─ cartSlice.ts   <-- You need state for the cart
│  ├─ types/
│  │  └─ index.ts          <-- specific types (IProduct, ICartItem)
│  ├─ utils/
│  │  └─ currency.ts       <-- specific helper for money
│  ├─ App.tsx
│  └─ index.tsx
```

---

# **🧰 Tech Stack**

### **Frontend**

* React 18
* TypeScript
* Tailwind CSS
* React Router

### **State Management**

* Redux Toolkit
* RTK Query (recommended over Axios)

### **Tools & Utilities**

* Vite / Create React App
* ESLint + Prettier
* Custom Hooks
* Type-safe interfaces

---

# **📡 API Integration (RTK Query)**

This project uses **RTK Query** for:

* Fetching product lists
* Fetching single product details
* Avoiding duplicate requests with built-in caching
* Auto-generated hooks for API calls

Example (inside `apiSlice.ts`):

```ts
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://fakestoreapi.com/" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),
  }),
});
```

---

# **🛠️ Installation & Setup**

### **1. Clone the repository**

```bash
git clone https://github.com/Y3B3L4Y3/alx-project-nexus.git
cd ecommerce-catalog
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Run the development server**

```bash
npm run dev
```

### **4. Build for production**

```bash
npm run build
```

---

# **📸 Screenshots (Add later)**

| Page           | Description                      |
| -------------- | -------------------------------- |
| Home Page      | Product grid, filters, search    |
| Product Detail | Product info + Add to Cart       |
| Cart Page      | Cart summary + price calculation |

---

# **🧩 What This Project Demonstrates**

✔️ Real-world frontend architecture
✔️ Clean, scalable folder structure
✔️ Reusable components & hooks
✔️ API integration using best practices
✔️ Redux Toolkit mastery
✔️ UI/UX design thinking
✔️ Professional code organization

Perfect for portfolios, client demos, and job applications.

---

# **🤝 Contributions**

PRs, suggestions, and improvements are welcome!

---

# **📄 License**

MIT License

---


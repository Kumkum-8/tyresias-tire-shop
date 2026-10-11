# Tyresias Tire Shop

Tyresias is a full-stack tire shop website built for a college project. It includes user login/register, inventory management, cart, order placement, profit/loss analytics, and an AI-powered recommendation assistant connected to the store data.

## Features

- ✅ User login and registration
- ✅ Shopping catalog with filter options
- ✅ Cart and checkout flow
- ✅ Admin inventory management
- ✅ Profit and loss dashboard with charts
- ✅ AI assistant using the Wikipedia API
- ✅ Revenue and analytics summary for store operations
- ✅ Data filters (brand, type, price)

## Tech Stack

- Frontend: HTML, CSS, JavaScript (Single Page App)
- Backend: Node.js + Express
- Storage: JSON file-based local database for demo purposes
- AI: Wikipedia API for tire research

## How to run on MacBook

### 1. Clone the repository

```bash
git clone https://github.com/Kumkum-8/tyresias-tire-shop.git
cd tyresias-tire-shop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
npm start
```

The app will be available at **http://localhost:3000**

### 4. For development (auto-reload)

```bash
npm run dev
```

## Default Admin Credentials

- Email: `admin@tyresias.com`
- Password: `admin123`

## Project Structure

```
tyresias-tire-shop/
├── server.js           # Backend Express server
├── index.html          # Main HTML page
├── app.js              # Frontend JavaScript logic
├── styles.css          # Responsive CSS styling
├── data/               # JSON database folder
│   └── store.json      # Store data (products, users, orders)
├── package.json        # Project dependencies
└── README.md           # This file
```

## Key Features & Requirements Met

### 1. User Authentication
- Login & Register functionality
- JWT-based authentication
- Password hashing with bcryptjs

### 2. E-Commerce
- Product catalog with 6 tire brands
- Shopping cart with add/remove functionality
- Order placement with order history

### 3. Admin Panel
- Add new tire products
- Manage inventory and stock levels
- View all products in admin panel

### 4. Data Analytics Dashboard
- Revenue tracking
- Profit & Loss calculation (28% profit margin)
- Brand-wise stock distribution
- Type-wise tire breakdown
- Recent orders table
- Price statistics

### 5. AI Assistant
- Wikipedia API integration for tire research
- Search by tire characteristics, brand, or conditions
- Fetches product recommendations based on search
- Fallback recommendations when API unavailable

### 6. Filtering & Search
- Filter by Brand (Tyresias, Michelin, Bridgestone, Apollo, JKU, Ceat)
- Filter by Type (All Season, City, Highway, Sport, Offroad, Eco)
- Filter by Price Range (₹3000 - ₹8000)
- Real-time product filtering

## Project Notes

This project is designed to be:
- ✅ Simple and easy to understand
- ✅ Production-ready for submission
- ✅ Runs perfectly on MacBook
- ✅ No complex dependencies
- ✅ Single command to start

## Database (store.json)

The app uses a JSON file for data storage with three main collections:

1. **Users** - User accounts with hashed passwords
2. **Products** - Tire inventory with prices and stock
3. **Orders** - Order history with profit calculations

## API Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/products` - Get all products (with filters)
- `POST /api/products` - Add new product (admin only)
- `GET /api/analytics` - Get profit/loss dashboard data
- `GET /api/ai` - Get AI recommendations
- `POST /api/orders` - Place new order

## Submission Checklist

- ✅ Login credentials working
- ✅ All components functional
- ✅ CRUD operations for inventory
- ✅ AI integration (Wikipedia)
- ✅ Data analytics with filters
- ✅ Profit/Loss tracking
- ✅ Deployment ready
- ✅ Documentation complete
- ✅ Responsive design (works on desktop and mobile)

## License

MIT

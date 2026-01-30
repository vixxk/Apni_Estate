<!-- ![ApniEstate Banner](...) -->

# ApniEstate Backend API

This is the power house of ApniEstate, providing a RESTful API for property management, user authentication, vendor services, and administrative controls.

## 🛠 Tech Stack

- **Framework**: Express.js
- **Runtime**: Node.js (v18+)
- **Database**: MongoDB with Mongoose ODM
- **Authenticaton**: JSON Web Tokens (JWT) & BcryptJS
- **Media**: ImageKit Node.js SDK
- **Email**: Nodemailer
- **Validation**: Joi & Express Validator

## 🚀 Getting Started

### Installation
```bash
cd backend
npm install
```

### Environment Variables
Create a `.env.local` file in the root of the backend directory:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
# ImageKit Config
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_endpoint
# Admin Credentials
ADMIN_EMAIL=admin@email.com
ADMIN_PASSWORD=your_admin_password
```

### Running the Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## 📁 Folder Structure

```bash
backend/
├── config/             # DB and third-party service configs
├── features/           # API Logic (Controller -> Model -> Routes)
│   ├── admin/          # Admin-specific controls
│   ├── appointments/   # Viewing schedules
│   ├── chat/           # Real-time communication
│   ├── properties/     # Real estate listings
│   └── ...             # Other features (AI tools, users, etc.)
├── middleware/         # Auth, error, and upload middlewares
├── scripts/            # Database migrations
└── uploads/            # Local storage for media (dev only)
```

## 📂 Key Features & Modules

- **Auth**: Secure login/signup for Users, Vendors, and Admins.
- **Properties**: CRUD operations for property listings with advanced filtering.
- **Vendors**: Onboarding flow and service request management.
- **Appointments**: Scheduling system for property viewings.
- **Tools**: Backend support for Vastu checks and loan analysis.

## 📜 Scripts

- `npm run dev`: Starts the server in development mode.
- `npm run migrate:old-properties`: Helper script to sync legacy data.
- `npm run render-build`: Custom build script for Render deployments.

## 🛡 Security

- Uses `helmet` for HTTP header security.
- implements `cors` for cross-origin access control.
- `express-rate-limit` to prevent brute force and DDoS.

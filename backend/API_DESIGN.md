# ApniEstate API Design

The ApniEstate Backend is designed as a RESTful API with consistency and security as top priorities.

## 🌉 Core Principles

- **Standard REST Verbs**: GET, POST, PUT, PATCH, DELETE used appropriately.
- **Stateless Auth**: JWT-based authentication via the `Authorization: Bearer <token>` header.
- **JSON Format**: All requests and responses use JSON.
- **Structured Errors**: Consistent error responses with `success: false` and `message` fields.

## 🛣 API Endpoints

### 👤 Authentication & Users
- `POST /api/users/signup`: Register a new account.
- `POST /api/users/login`: Authenticate and receive a JWT.
- `GET /api/users/profile`: retrieve current logged-in user details.
- `PATCH /api/users/profile`: Update user information.

### 🏠 Property Management
- `GET /api/properties`: Fetch property listings (with pagination and filters).
- `GET /api/properties/:id`: Get detailed information for a specific property.
- `POST /api/properties`: Create a new property listing (Requires Admin/Vendor).
- `PATCH /api/properties/:id`: Update an existing property.
- `DELETE /api/properties/:id`: Remove a listing.

### 🛠 Vendor Services
- `GET /api/vendor/services`: List all professional services.
- `POST /api/vendor/services`: Add a new service offering.
- `GET /api/contact-requests/vendor/requests`: View inquiries from potential clients.

### 📅 Appointments & Interactions
- `POST /api/appointments`: Book a property viewing.
- `GET /api/appointments/my`: List appointments for the current user.
- `POST /api/forms`: Generic contact form submission.

## 🛡 Security & Middleware

- **Protect**: Middleware to ensure the request has a valid JWT.
- **Authorize**: Role-based access control (`admin`, `vendor`, `user`).
- **Rate Limit**: Applied to sensitive routes (login/signup) to prevent abuse.
- **Helmet**: Secures HTTP headers.

## 📡 Sample Response

```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "Luxury Villa",
    "price": 5000000
  }
}
```

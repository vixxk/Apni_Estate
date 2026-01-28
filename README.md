# ApniEstate - Premium Real Estate Platform

ApniEstate is a Real Estate Marketplace that connects property buyers, sellers, and service providers into a single, seamless ecosystem. The platform offers a modern experience for property listings and professional services like Vastu consultancy and loan analysis.

## 🏗 Project Architecture

ApniEstate is built as a decoupled full-stack application:

-   **Frontend**: A modern, responsive React application built with Vite, Tailwind CSS, and Framer Motion for high-end aesthetics.
-   **Backend**: A robust Node.js/Express API leveraging MongoDB for data persistence and ImageKit for cloud-based media management.

```mermaid
    User((User)) <--> Frontend[React Frontend]
    Frontend <--> Backend[Express API]
    Backend <--> DB[(MongoDB)]
    Backend <--> ImageKit[Media Storage]
    Backend <--> Mailer[Nodemailer]
```

## 🚀 Quick Start

To get the entire project running locally, follow these steps:

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: A running instance (local or Atlas)
- **ImageKit Account**: For media uploads

### 2. Clone the Repository
```bash
git clone https://github.com/vixxk/Apni_Estate.git
cd Apni_Estate
```

### 3. Setup Backend
```bash
cd backend
npm install
# Configure your .env.local (see backend/README.md)
npm run dev
```

### 4. Setup Frontend
```bash
cd ../frontend
npm install
# Configure your .env.local (see frontend/README.md)
npm run dev
```

## 📁 Directory Structure

-   [`backend/`](file:///home/vixx/Downloads/apniestate/Apni_Estate/backend): Express API, Auth, Property management, and Vendor services.
-   [`frontend/`](file:///home/vixx/Downloads/apniestate/Apni_Estate/frontend): React UI, State management, and polished UX components.

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express, MongoDB/Mongoose, JWT |
| **Storage** | ImageKit.io |
| **Utilities** | Axios, React Toastify, Nodemailer |

---

For detailed documentation on each component, please refer to their respective directories.

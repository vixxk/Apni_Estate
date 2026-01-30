# ApniEstate Frontend - Premium UI

The frontend of ApniEstate is a modern, performance-oriented React application. It provides a premium, "wow" factor user experience with smooth animations, responsive layouts, and a clean design system.

## 🛠 Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: Custom components built with Tailwind CSS
- **Routing**: React Router 7
- **State/Auth**: Context API with local storage persistence

## 📁 Folder Structure

```bash
frontend/
├── src/
│   ├── assets/         # Images, global CSS, and static files
│   ├── components/     # UI Building Blocks
│   │   ├── common/     # Loaders, Modals, Not Found
│   │   ├── layout/     # Navbar, Footer, Mobile Nav
│   │   └── SEO/        # Structured data & Meta tags
│   ├── context/        # Global React Contexts
│   ├── features/       # Complex UI modules
│   │   ├── ai-tools/   # Vastu, Estimators, Loan Analysis
│   │   ├── auth/       # Login, Signup, Security
│   │   ├── properties/ # Listings, Details, Map integration
│   │   └── ...         # Home, Services, Chat
│   └── services/       # Axios API layer
```

## 📂 Core Directories

## 🚀 Getting Started

### Installation
```bash
cd frontend
npm install
```

### Environment Variables
Create a `.env.local` file in the root of the frontend directory:

```env
VITE_API_URL=http://localhost:4000
```

### Running the App
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ✨ Design Principles

1. **Aesthetics First**: Every component is styled to feel premium and modern.
2. **Micro-interactions**: Subtle hover effects and transitions using Framer Motion.
3. **Responsiveness**: Mobile-first approach using Tailwind's layout utilities.
4. **SEO**: Integration of `react-helmet-async` for dynamic meta tags.

## 📦 Key Dependencies

- `axios`: For API communication.
- `react-toastify`: For elegant feedback notifications.
- `framer-motion`: For high-quality UI animations.
- `lucide-react`: For a consistent iconography.

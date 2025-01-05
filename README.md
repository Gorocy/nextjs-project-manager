# Project Manager

A modern, full-stack project management application built with Next.js 14, TypeScript, Prisma, and MySQL.

## 🌟 Features

### Authentication
- Secure user authentication with JWT
- Protected routes and API endpoints
- Password hashing with bcrypt
- Persistent sessions with cookies

### Projects
- Create new projects with title and description
- View all projects in a clean, responsive layout
- Delete projects with confirmation
- Real-time updates

### Tasks
- Create tasks within projects
- Assign tasks to users
- Update task status (Todo, In Progress, Done)
- Delete tasks
- Real-time task status updates

### UI/UX
- Modern, responsive design with Tailwind CSS
- Loading states and animations
- Error handling and user feedback
- Modal confirmations for destructive actions
- Clean and intuitive navigation

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: State management and side effects
- **Custom Components**: Reusable UI components

### Backend
- **Next.js API Routes**: Server-side endpoints
- **Prisma**: Type-safe database ORM
- **MySQL**: Relational database
- **JWT**: Authentication tokens
- **Edge Runtime Compatible**: Using jose for JWT handling

### Development Tools
- ESLint: Code linting
- Prettier: Code formatting
- TypeScript: Static type checking

## 📁 Project Structure

```
my-project-manager/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   └── projects/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   ├── TaskItem.tsx
│   │   └── ConfirmDialog.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   └── jwt.ts
│   ├── hooks/
│   │   └── useApi.ts
│   └── types/
│       └── index.ts
├── prisma/
│   └── schema.prisma
└── public/
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/my-project-manager.git
cd my-project-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# .env
DATABASE_URL="mysql://user:password@localhost:3306/project_management"
JWT_SECRET="your-secret-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

## 🗄️ Database Schema

### User
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  username  String
  projects  Project[]
  tasks     Task[]
  createdAt DateTime @default(now())
}
```

### Project
```prisma
model Project {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  ownerId     Int
  owner       User     @relation(fields: [ownerId], references: [id])
  tasks       Task[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Task
```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      String   @default("TODO")
  projectId   Int
  project     Project  @relation(fields: [projectId], references: [id])
  assignedTo  Int
  assignee    User     @relation(fields: [assignedTo], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔒 Authentication Flow

1. User submits login credentials
2. Server validates credentials and generates JWT
3. JWT is stored in localStorage and cookies
4. Token is included in Authorization header for API requests
5. Middleware validates token for protected routes
6. Invalid tokens redirect to login page

## 🔄 API Routes

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration

### Projects
- `GET /api/projects`: List all projects
- `POST /api/projects`: Create new project
- `GET /api/projects/[id]`: Get project details
- `DELETE /api/projects/[id]`: Delete project

### Tasks
- `GET /api/projects/[id]/tasks`: List project tasks
- `POST /api/projects/[id]/tasks`: Create new task
- `PUT /api/projects/[id]/tasks/[taskId]`: Update task
- `DELETE /api/projects/[id]/tasks/[taskId]`: Delete task

## 🎨 UI Components

### Button
- Primary and danger variants
- Loading state with spinner
- Disabled state
- Customizable via className

### Input
- Label support
- Error state
- Required field indication
- Auto-complete support

### ConfirmDialog
- Modal overlay
- Title and message
- Confirm and cancel actions
- Keyboard accessible

### TaskItem
- Status indicator
- Status update dropdown
- Description display
- Loading states

## 🔧 Development

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Database Management
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema changes
npm run prisma:push

# Open Prisma Studio
npm run prisma:studio
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work - [YourGithub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS team for the utility-first CSS framework

# Team Management Tool

A modern web application for efficient team management and collaboration built with Next.js 14. This project is being built for my Dissertation.

## 🚀 Features

- User Authentication
- Team Creation and Management
- Task Assignment and Tracking
- Real-time Updates
- Responsive Design
- Modern UI/UX with Geist Font

## 💻 Tech Stack

- [Next.js 14](https://nextjs.org)
- TypeScript
- React
- [Appwrite](https://appwrite.io)
- Vercel Deployment
- [Geist Font](https://vercel.com/font)

## 🛠️ Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create an appwrite project with the following database structure

```bash
WORKSPACES_ID
MEMBERS_ID
PROJECTS_ID
TASKS_ID
```

4. Create .env.local file and populate the following fields

```bash
NEXT_PUBLIC_APP_URL

NEXT_PUBLIC_APPWRITE_ENDPOINT
NEXT_PUBLIC_APPWRITE_PROJECT_ID
NEXT_PUBLIC_APPWRITE_DATABASE_ID
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID
NEXT_PUBLIC_APPWRITE_MEMBERS_ID
NEXT_PUBLIC_APPWRITE_PROJECTS_ID
NEXT_PUBLIC_APPWRITE_TASKS_ID
NEXT_PUBLIC_APPWRITE_STORAGE_ID

NEXT_APPWRITE_KEY
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Development

- Edit any `page.tsx | client.tsx | layout.tsx` inside `src/app` to modify the app
- Changes are reflected immediately with hot reloading
- Project uses Next.js App Router architecture

## 📚 Documentation

For detailed information, refer to:

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learning Guide](https://nextjs.org/learn)

## 🚀 Deployment

Deploy easily with [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Deploy automatically

## 📄 License

This project is under the MIT License.

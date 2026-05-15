[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/-nyOcXJT)

# LittleStep — Frontend

A micro-learning app built around a theme park concept for children aged 4–10. Kids learn through short modules and interactive quizzes, guided by "ride" icons placed on a park map.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** strict
- **Tailwind CSS** + **shadcn/ui**
- **Zustand** — state management (auth & quiz session)
- **Fetch API** with a custom wrapper (`lib/api.ts`)

## Deployment

- Backend API: [LittleStep API](https://enchanting-harmony-production-0f83.up.railway.app/)
- Frontend App:[Frontend](https://crack-fe-rahmat-bagus-santoso.vercel.app/)
- API Documentation: [Swagger](https://enchanting-harmony-production-0f83.up.railway.app/api/docs)


## Setup

```bash
npm install
```

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_API_URL=https://<backend-url>
```

## Running

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Folder Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page (public)
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login — parent & admin
│   │   ├── register/page.tsx       # Register — new parent
│   │   └── avatar/page.tsx         # Child profile selection (Netflix-style)
│   ├── (child)/
│   │   ├── park/page.tsx           # Park map — module list
│   │   ├── learn/[id]/page.tsx     # Lesson content per module
│   │   └── quiz/[id]/page.tsx      # Quiz session per lesson
│   ├── (parent)/
│   │   └── dashboard/page.tsx      # Parent dashboard — child progress
│   └── admin/
│       └── page.tsx                # Admin CMS — CRUD modules/lessons/quizzes
├── components/
│   ├── ui/                         # shadcn/ui components
│   └── park/
│       ├── ParkLayout.tsx          # Park map with overlaid ride icons
│       └── ParkScene.tsx           # Park visual decoration
├── store/
│   ├── useUserStore.ts             # Auth state — token, user, activeChild
│   └── useQuizStore.ts             # Quiz session — questions, progress, submissions
├── lib/
│   ├── api.ts                      # Fetch wrapper — auto-attaches JWT
│   └── utils.ts                    # Utility (cn)
└── types/
    └── types.ts                    # Type definitions matching API responses
```

## Roles & Flow

| Role | Flow |
|------|------|
| **Parent** | Register → Login → Select child → Dashboard / Park |
| **Child** | Selected by parent → Park → Lesson → Quiz |
| **Admin** | Login → Admin CMS (content CRUD) |

Children do not have their own accounts — all requests use the parent's JWT. The active child session is stored in Zustand after `POST /children/:id/access`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend base URL without `/api/v1` |

## Static Assets

| File | Location |
|------|----------|
| Park map image | `public/assets/ParkMap.webp` |

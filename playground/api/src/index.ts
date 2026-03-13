import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

let nextUserId = 4;
let nextPostId = 4;

const users: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", createdAt: "2025-01-15T10:30:00Z" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", createdAt: "2025-02-20T14:15:00Z" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", createdAt: "2025-03-10T09:00:00Z" },
];

const posts: Post[] = [
  {
    id: 1,
    userId: 1,
    title: "Getting Started with Elysia",
    body: "Elysia is a fast, type-safe web framework built for Bun...",
  },
  {
    id: 2,
    userId: 1,
    title: "Eden Treaty Deep Dive",
    body: "Eden Treaty provides end-to-end type safety between your server and client...",
  },
  {
    id: 3,
    userId: 2,
    title: "Vue Query Patterns",
    body: "TanStack Query for Vue brings powerful data fetching primitives...",
  },
];

const app = new Elysia({ adapter: node() })
  .use(cors())
  .derive(async () => {
    // Add artificial delay to simulate real-world latency (500ms)
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {};
  })
  .get("/users", () => users, {
    response: t.Array(
      t.Object({
        id: t.Number(),
        name: t.String(),
        email: t.String(),
        createdAt: t.String(),
      }),
    ),
  })
  .get(
    "/users/:id",
    ({ params }) => {
      const user = users.find((u) => u.id === Number(params.id));
      if (!user) throw new Error("User not found");
      return user;
    },
    {
      params: t.Object({ id: t.String() }),
    },
  )
  .post(
    "/users",
    ({ body }) => {
      const user: User = {
        id: nextUserId++,
        name: body.name,
        email: body.email,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      return user;
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
      }),
    },
  )
  .put(
    "/users/:id",
    ({ params, body }) => {
      const user = users.find((u) => u.id === Number(params.id));
      if (!user) throw new Error("User not found");
      user.name = body.name;
      user.email = body.email;
      return user;
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
      }),
    },
  )
  .delete(
    "/users/:id",
    ({ params }) => {
      const index = users.findIndex((u) => u.id === Number(params.id));
      if (index === -1) throw new Error("User not found");
      const deleted = users.splice(index, 1)[0]!;
      return deleted;
    },
    {
      params: t.Object({ id: t.String() }),
    },
  )
  .get(
    "/users/:id/posts",
    ({ params }) => {
      return posts.filter((p) => p.userId === Number(params.id));
    },
    {
      params: t.Object({ id: t.String() }),
    },
  )
  .get("/posts", () => posts, {
    response: t.Array(
      t.Object({
        id: t.Number(),
        userId: t.Number(),
        title: t.String(),
        body: t.String(),
      }),
    ),
  })
  .post(
    "/posts",
    ({ body }) => {
      const post: Post = {
        id: nextPostId++,
        userId: body.userId,
        title: body.title,
        body: body.body,
      };
      posts.push(post);
      return post;
    },
    {
      body: t.Object({
        userId: t.Number(),
        title: t.String(),
        body: t.String(),
      }),
    },
  )
  .put(
    "/posts/:id",
    ({ params, body }) => {
      const post = posts.find((p) => p.id === Number(params.id));
      if (!post) throw new Error("Post not found");
      post.title = body.title;
      post.body = body.body;
      return post;
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.String(),
        body: t.String(),
      }),
    },
  )
  .delete(
    "/posts/:id",
    ({ params }) => {
      const index = posts.findIndex((p) => p.id === Number(params.id));
      if (index === -1) throw new Error("Post not found");
      const deleted = posts.splice(index, 1)[0]!;
      return deleted;
    },
    {
      params: t.Object({ id: t.String() }),
    },
  )
  .listen(3000);

export type App = typeof app;

console.log(`🦊 Elysia playground API running at http://localhost:3000`);

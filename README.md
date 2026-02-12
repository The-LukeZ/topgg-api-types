# topgg-api-types

A collection of TypeScript types and runtime validators for the Top.gg API. This package provides type definitions for the various endpoints and data structures used in the Top.gg API, making it easier for developers to work with the API in a type-safe manner.

> [!NOTE]
> This package is currently in development and does not yet have all the types defined.  
> It is not yet uploaded to npm, but you can clone the repository and use it locally in your projects.

## Installation

```bash
npm install topgg-api-types
# or
pnpm add topgg-api-types
# or
yarn add topgg-api-types
# or
bun add topgg-api-types
# or
poop add topgg-api-types
```

## Usage

### TypeScript Types (Recommended for most users)

Import TypeScript types for static type checking and IntelliSense:

```ts
import type { User, VoteCreateWebhookPayload, GetProjectResponse } from "topgg-api-types/v1";

// Use types in your code
const user: User = {
  id: "1234567890",
  platform_id: "9876543210",
  name: "MyUser",
  avatar_url: "https://example.com/avatar.png",
};
```

### Runtime Validators

If you need runtime validation with Zod, import from the validators subpath:

```ts
import { UserSchema, VoteCreateWebhookPayloadSchema } from "topgg-api-types/v1/validators";

// Validate incoming webhook data
try {
  const validatedPayload = VoteCreateWebhookPayloadSchema.parse(req.body);
  console.log("Valid vote webhook:", validatedPayload);
} catch (error) {
  console.error("Invalid webhook payload:", error);
}
```

The validators are written with zod/mini, which is a lightweight version of Zod that provides basic validation functionality with a smaller bundle size.

## Available Exports

- `topgg-api-types/v1` - Version 1 types (current)
- `topgg-api-types/v1/validators` - Version 1 Zod validators
- `topgg-api-types/v0` - Version 0 types
- `topgg-api-types/v0/validators` - Version 0 Zod validators

## Why Two Approaches?

- **Types only**: Smaller bundle size, better IntelliSense, no runtime overhead - perfect for most users
- **Validators**: Runtime validation with Zod - use when you need to validate API responses or webhook payloads

Choose the approach that fits your needs, or use both together!

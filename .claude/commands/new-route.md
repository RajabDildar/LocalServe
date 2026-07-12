Scaffold a complete route module for: $ARGUMENTS

Create these files:

1. server/src/routes/$name.routes.ts — Express router, import controller functions
2. server/src/controllers/$name.controller.ts — Controller stubs wrapped in asyncHandler
3. server/src/validators/$name.validator.ts — Zod schemas for request validation

Rules:

- Controllers must be thin: validate input, call service, return ApiResponse
- Each controller function: asyncHandler(async (req, res) => { ... })
- Every POST/PUT route must have a validate(schema) middleware
- Register the new router in server/src/app.ts

Show me all three files after creating them.

import express, { type Response, type Request } from "express";
let app: express.Application = express();

// routes
app.get("/status", (req: Request, res: Response): void => {
  res.status(200).send("server is working fine!");
});

export default app;

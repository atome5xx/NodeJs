import express from "express";

const router = express.Router();

import movieController from "../controller/movieController.js";

router.get("/", movieController.getAll);
router.get("/:id", movieController.getById);

export default router;
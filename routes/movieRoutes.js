import express from "express";

const router = express.Router();

import movieController from "../controller/movieController.js";

router.get("/", movieController.getAll);
router.get("/:params", movieController.getById);
router.delete("/:id", movieController.deleteMovie);
router.put("/:id", movieController.updateMovie);

export default router;
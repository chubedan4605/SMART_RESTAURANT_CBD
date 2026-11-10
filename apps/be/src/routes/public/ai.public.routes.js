const express = require("express");
const router = express.Router();
const aiController = require("../../controllers/aiController");

router.get("/suggestions", aiController.getSuggestions);
router.get("/history", aiController.getHistory);
router.post("/reset", aiController.resetSession);
router.post("/chat", aiController.chat);
router.post("/chat/stream", aiController.chatStream);

module.exports = router;

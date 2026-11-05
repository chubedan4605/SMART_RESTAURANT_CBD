const express = require("express");
const router = express.Router();
const aiController = require("../../controllers/aiController");

router.get("/suggestions", aiController.getSuggestions);
router.post("/chat", aiController.chat);
router.post("/chat/stream", aiController.chatStream);

module.exports = router;


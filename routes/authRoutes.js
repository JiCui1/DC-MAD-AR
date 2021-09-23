const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.get("/confirm/:confirmationCode", authController.verifyUser);
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.get("/password_reset", authController.password_reset_get);
router.post("/password_reset", authController.password_reset_post);
router.get("/password_reset/:email", authController.pass_reset_get);
router.post("/password_reset/:email", authController.pass_reset_post);

module.exports = router;

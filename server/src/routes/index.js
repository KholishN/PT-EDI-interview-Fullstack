const { Router } = require("express");
const { register, login, checkAuth, logout } = require("../controllers/AuthController.js");
const {form, listForms ,listEducations, listSkills, listTrainings, listWorkhitories, updateForm , deleteForm} = require("../controllers/FormController.js");
const { auth } = require("../middleware/AuthMiddleware.js");

const router = Router();

// auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);
router.get("/logout", auth, logout);

// form routes
router.post("/form",auth,form);
router.post("/update-form",auth,updateForm);
router.post("/delete-form",auth,deleteForm);
router.post("/list-forms",auth,listForms);
router.post("/list-educations",auth,listEducations);
router.post("/list-trainings",auth,listTrainings);
router.post("/list-skills",auth,listSkills);
router.post("/list-work-hitories",auth,listWorkhitories);

module.exports = router;

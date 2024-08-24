const express = require('express');

const router = express.Router();

const userControllers = require('../controllers/userControllers')

const auth = require("../auth");

const {verify, verifyAdmin} = auth;


// [REGISTRATOPM]
router.post("/register", userControllers.registerUser);

// [RETRIEVE ALL USERS]
router.get("/", verify, verifyAdmin, userControllers.getAllUsers);

// [LOG IN]
router.post("/login", userControllers.loginUser)

// [UPDATE USER AS ADMIN]
router.put("/updateAdmin/:id", verify, verifyAdmin, userControllers.updateAdmin);

// [UPDATE USER AS NOT ADMIN]
router.put("/updateNotAdmin/:id", verify, verifyAdmin, userControllers.updateNotAdmin);

// [RETRIEVE USER PROFILE (for current user ONLY)]
router.get("/profile", verify, userControllers.getUserProfile);

// [RETRIEVE SINGLE USER]
router.get("/:id", verify, verifyAdmin, userControllers.getSingleUser);

//[SECTION] Route to buy user to a product
router.post('/buy', verify, userControllers.buy);


module.exports = router;
const { Router } = require("express");
const {
  usersGet,
  usersPost,
  usersDelete,
  usersPut,
} = require("../controllers/users");

const router = Router();

router.get("/", usersGet);

router.post("/", usersPost);

router.put("/:id", usersPut);

router.delete("/", usersDelete);

module.exports = router;

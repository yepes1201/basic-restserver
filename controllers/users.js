const { request, response } = require("express");

const usersGet = (req = request, res = response) => {
  const { q, name, city } = req.query;
  res.json({
    ok: true,
    msg: "get API",
  });
};

const usersPost = (req = request, res = response) => {
  const body = req.body;
  console.log(body);
  res.json(body);
};

const usersDelete = (req = request, res = response) => {
  res.json({
    ok: true,
    msg: "delete API",
  });
};

const usersPut = (req = request, res = response) => {
  const id = req.params.id;
  res.json({
    ok: true,
    msg: "put API",
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersDelete,
  usersPut,
};

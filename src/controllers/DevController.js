const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    //somente novos desenvolvedores
    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } }, //não traz o dev logado
        { _id: { $nin: loggedDev.likes } }, //not in, não traz os devs que ele deu likes
        { _id: { $nin: loggedDev.dislikes } } //not in, não traz os devs que ele deu dislikes
      ]
    });

    return res.json(users);
  },

  async store(req, res) {
    const { username } = req.body;

    const userExists = await Dev.findOne({ user: username });

    if (userExists) {
      return res.json(userExists);
    }

    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    return res.json(dev);
  }
};

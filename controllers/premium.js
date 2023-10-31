const User = require("../models/user-model");
const mongoose = require('mongoose');

const getUserLeaderboard = async (req, res) => {
  try {
    const leaderboardofusers = await User.find().sort([['total', 'desc']]);
    res.status(200).json(leaderboardofusers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getUserLeaderboard,
};































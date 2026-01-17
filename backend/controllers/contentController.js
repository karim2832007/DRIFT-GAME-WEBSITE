const Content = require("../models/contentModel");

exports.getHomeContent = async (req, res) => {
  try {
    let home = await Content.findOne({ page: "home" });

    if (!home) {
      home = await Content.create({
        page: "home",
        title: "CYBER DRIFT X",
        subtitle: "Official Game Portal",
        description: "A cyberpunk drift universe forged in Unity."
      });
    }

    res.json(home);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
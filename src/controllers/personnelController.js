const personnelService = require("../services/personnelService");

exports.importPersonnel = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid data format — expected an array." });
    }

    const count = await personnelService.importPersonnel(data);

    res.status(201).json({
      message: `✅ Successfully imported ${count} personnel records.`,
    });
  } catch (error) {
    console.error("❌ Error importing personnel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPersonnelInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const personnel = await personnelService.getPersonnelInfo(userId);

    if (!personnel) {
      return res.status(404).json({ error: "Personnel not found" });
    }

    res.status(200).json(personnel);
  } catch (error) {
    console.error("Error fetching personnel info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

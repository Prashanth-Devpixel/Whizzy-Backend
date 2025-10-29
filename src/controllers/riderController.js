const riderService = require("../services/riderService");

exports.getRidersByLocation = async (req, res) => {
  try {
    const { location, pageToken } = req.query;

    const result = await riderService.getRidersPaginated(
      50, // ✅ fixed limit
      pageToken || null,
      location || null
    );

    res.status(200).json({
      count: result.riders.length,
      riders: result.riders,
      nextPageToken: result.nextPageToken,
    });
  } catch (error) {
    console.error("Error fetching paginated riders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

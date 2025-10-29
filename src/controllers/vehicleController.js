const { fetchAllVehicles } = require("../services/vehicleService");
const vehicleService = require("../services/vehicleService");
const { admin, db } = require("../config/firebase");

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await fetchAllVehicles();
    res.status(200).json({
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error("❌ Error fetching vehicles:", error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

exports.createEV = async (req, res) => {
  try {
    const data = req.body;

    // If multiple EVs are sent as an array
    if (Array.isArray(data)) {
      const batch = db.batch();
      let count = 0;

      for (const ev of data) {
        if (!ev.id && !ev.plateNumber) continue; // Require either id or plateNumber

        // Use provided id OR fall back to plateNumber (without spaces)
        const docId = ev.id ? ev.id : ev.plateNumber.replace(/\s/g, "");

        const evRef = db.collection("EV").doc(docId);

        batch.set(evRef, {
          ...ev,
          location: ev.location || null, // optional location field
          CreatedDate: new Date(),
          updatedDate: new Date(),
        });

        count++;
      }

      await batch.commit();

      return res.status(201).json({
        message: `✅ Successfully added ${count} EV records`,
      });
    }

    // Handle single EV record
    if (!data.id && !data.plateNumber) {
      return res.status(400).json({
        error: "Either 'id' or 'plateNumber' is required",
      });
    }

    const docId = data.id ? data.id : data.plateNumber.replace(/\s/g, "");
    const evRef = db.collection("EV").doc(docId);

    await evRef.set({
      ...data,
      location: data.location || null, // optional location field
      CreatedDate: new Date(),
      updatedDate: new Date(),
    });

    res.status(201).json({
      message: "✅ EV created successfully",
      id: evRef.id,
    });
  } catch (error) {
    console.error("❌ Error creating EV(s):", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getVehiclesByLocation = async (req, res) => {
  try {
    const { location, pageToken } = req.query;  // ❌ no limit from client

    const result = await vehicleService.getVehiclesPaginated(
      9, 
      pageToken || null,
      location || null
    );

    res.status(200).json({
      count: result.vehicles.length,
      vehicles: result.vehicles,
      nextPageToken: result.nextPageToken,
    });
  } catch (error) {
    console.error("Error fetching paginated vehicles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getVehicleInfo = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    if (!vehicleId) {
      return res.status(400).json({ error: "Vehicle ID (plateNumber) is required" });
    }

    const vehicle = await vehicleService.getVehicleInfo(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error("❌ Error fetching vehicle info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






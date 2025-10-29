const { db } = require("../config/firebase");

exports.fetchAllVehicles = async () => {
  const snapshot = await db.collection("EV").get();
  const vehicles = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      plateNumber: data.plateNumber || "",
      make: data.make || "",
      model: data.model || "",
      depositAmount: data.depositAmount || 0,
      rentalRate: data.rentalRate || 0
    };
  });
  return vehicles;
};


exports.getVehiclesPaginated = async (limit = 9, pageToken = null, location = null) => {
  try {
    let query = db.collection("EV").orderBy("plateNumber"); // can order by another indexed field if you prefer

    // optional filter
    if (location) {
      query = query.where("location", "==", location);
    }

    // 🔐 decode the token (if provided)
    if (pageToken) {
      const decodedId = Buffer.from(pageToken, "base64").toString("ascii");
      const lastDoc = await db.collection("EV").doc(decodedId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    // fetch records
    const snapshot = await query.limit(limit).get();
    const vehicles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 🔐 encode next page token (if any)
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    const nextPageToken = lastVisible
      ? Buffer.from(lastVisible.id).toString("base64")
      : null;

    return { vehicles, nextPageToken };
  } catch (error) {
    console.error("Error in getVehiclesPaginated:", error);
    throw error;
  }
};


exports.getVehicleInfo = async (vehicleId) => {
  try {
    // Firestore docId = plateNumber without spaces
    const docId = vehicleId.replace(/\s/g, "");
    const docRef = db.collection("EV").doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error("Error fetching vehicle info:", error);
    throw error;
  }
};

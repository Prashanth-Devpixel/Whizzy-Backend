const { db } = require("../config/firebase");

exports.getRidersPaginated = async (limit = 50, pageToken = null, location = null) => {
  try {
    let query = db.collection("Personnel")
      .where("position", "==", "Rider") // ✅ only riders
      .orderBy("name"); // can use 'id' if you prefer alphabetical sorting by ID

    // optional location filter
    if (location) {
      query = query.where("location", "==", location);
    }

    // 🔐 decode the page token (if provided)
    if (pageToken) {
      const decodedId = Buffer.from(pageToken, "base64").toString("ascii");
      const lastDoc = await db.collection("Personnel").doc(decodedId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    // fetch limited records
    const snapshot = await query.limit(limit).get();
    const riders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 🔐 encode next page token (if any)
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    const nextPageToken = lastVisible
      ? Buffer.from(lastVisible.id).toString("base64")
      : null;

    return { riders, nextPageToken };
  } catch (error) {
    console.error("Error in getRidersPaginated:", error);
    throw error;
  }
};

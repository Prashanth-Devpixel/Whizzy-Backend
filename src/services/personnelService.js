const { db } = require("../config/firebase");

exports.importPersonnel = async (data) => {
  try {
    const batch = db.batch();
    let count = 0;

    data.forEach((person) => {
      if (!person.ID) return;

      const docRef = db.collection("Personnel").doc(person.ID);

      const record = {
        id: person.ID,
        name: person.Name || null,
        phone: person.Phone || null,
        position: person.Position || null,
        supervisorId: person["Supervisor ID"] || null,
        location: person.City || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      batch.set(docRef, record);
      count++;
    });

    await batch.commit();
    return count;
  } catch (error) {
    console.error("❌ Error saving personnel data:", error);
    throw error;
  }
};

exports.getPersonnelInfo = async (userId) => {
  try {
    // Document ID is the same as userId (e.g., "ATU-630")
    const docRef = db.collection("Personnel").doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    // Return the complete record
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error("❌ Error fetching personnel info:", error);
    throw error;
  }
};
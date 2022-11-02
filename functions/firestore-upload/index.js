const Firestore = require("@google-cloud/firestore");
// Use your project ID here
const PROJECTID = "skyskolen-bysykkel";
const COLLECTION_NAME = "sykkelturer";

const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true,
  // NOTE: Don't hardcode your project credentials here.
  // If you have to, export the following to your shell:
  //   GOOGLE_APPLICATION_CREDENTIALS=<path>
  keyFilename: "./datastore-credential.json",
});

/**
 * Retrieve or store a method in Firestore
 *
 * Responds to any HTTP request.
 *
 * GET = retrieve
 * POST = store (no update)
 *
 * success: returns the document content in JSON format & status=200
 *    else: returns an error:<string> & status=404
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.main = (req, res) => {
  if (req.method === "POST") {
    const trips = getJson();
    var batch = firestore.batch();
    trips.forEach((trip, i) => {
      const docRef = firestore.collection(COLLECTION_NAME).doc();
      batch.set(docRef, trip);
      if (0 === i % 500) {
        batch.commit();
        batch = firestore.batch();
      }
    });
    batch
      .commit()
      .then(() => {
        console.log("Batch write succeeded");
        res.status(200).send("Batch write succeeded");
      })
      .catch((err) => {
        console.log("Batch write failed", err);
        res.status(200).send("Batch write failed");
      });
  }
};

const getJson = () => {
  const fs = require("fs");
  const path = require("path");
  const filePath = path.join("./", "09.json");
  const file = fs.readFileSync(filePath);
  const json = JSON.parse(file);

  // Kun for testing ⬇️
  const trips = json.slice(0, 1);
  return trips;
};

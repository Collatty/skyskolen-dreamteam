const Firestore = require('@google-cloud/firestore');
// Use your project ID here
const PROJECTID = 'skyskolen-bysykkel';
const COLLECTION_NAME = 'sykkelturer';

const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true,
  // NOTE: Don't hardcode your project credentials here.
  // If you have to, export the following to your shell:
  //   GOOGLE_APPLICATION_CREDENTIALS=<path>
  keyFilename: './datastore-credential.json',
});

/**
 * Get bike station data
 *
 * success: returns the bike station data in JSON format & status=200
 *    else: returns an error:<string> & status=404
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.main = async (req, res) => {
  // TODO: use stationName from HTTP request
  const stationName = 'Skøyen'; // TEST-VALUE

  if (req.method === 'GET') {
    // Create a reference to the collection
    const collection = firestore.collection(COLLECTION_NAME);

    // Create query against the collection.
    const queryTripsStarted = query(
      collection,
      where('start_station_name', '==', stationName)
    );
    const queryTripsEnded = query(
      collection,
      where('end_station_name', '==', stationName)
    );

    // Count documents
    // https://firebase.google.com/docs/firestore/query-data/aggregation-queries
    const snapshotStarted = await queryTripsStarted.count().get();
    const snapshotEnded = await queryTripsEnded.count().get();

    const totalNumberOfTrips =
      snapshotEnded.data().count + snapshotStarted.data().count;

    // TODO: test that data is returned
    return res.status(200).send(totalNumberOfTrips);
  }
};

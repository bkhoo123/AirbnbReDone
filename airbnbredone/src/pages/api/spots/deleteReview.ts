// pages/api/spots/updateReview.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    const { spotId, reviewIndex } = req.body;

    try {
      const db = await connectToDatabase();
      const spotsCollection = db.collection("Spots");

      const spot = await spotsCollection.findOne({ _id: new ObjectId(spotId as string) });
      const reviewToRemove = spot?.reviews[reviewIndex];

      const result = await spotsCollection.updateOne(
        { _id: new ObjectId(spotId as string) },
        {
          $pull: {
            reviews: reviewToRemove,
          },
        }
      );

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ success: false, message: "Error updating review" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};

export default handler;

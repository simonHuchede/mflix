import clientPromise from "../../../../lib/mongodb";
import {ObjectId} from "mongodb";

/**
  * @swagger
  * /api/movie/comment/{id}:
  *   get:
  *     tags: [Comment]
  *     summary: Retrieve a comment by its ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The comment ID
  *     responses:
  *       200:
  *         description: Comment found and returned
  *       404:
  *         description: Comment not found
  *       500:
  *         description: Internal server error
  *
  *   delete:
  *     tags: [Comment]
  *     summary: Delete a comment by its ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The comment ID
  *     responses:
  *       200:
  *         description: Comment successfully deleted
  *       404:
  *         description: Comment not found, can't proceed deletion
  *       500:
  *         description: Failed to delete comment
  *
  *   put:
  *     tags: [Comment]
  *     summary: Update a comment by its ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The comment ID
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               _id:
  *                 type: string
  *               name:
  *                 type: string
  *               email:
  *                 type: string
  *               movie_id:
  *                 type: string
  *               text:
  *                 type: string
  *               date:
  *                 type: string
  *                 format: date-time
  *     responses:
  *       200:
  *         description: Comment successfully updated
  *       404:
  *         description: Comment not found or no changes made
  *       500:
  *         description: Failed to update comment
 */

export default async function handler(req, res) {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const payload = req.body;

    switch (req.method) {
        case "PUT":
            try{
                delete payload._id;
                const updated = await db.collection("comments")
                    .updateOne({_id: new ObjectId(id)}, {$set: payload});
                res.statusCode = updated.modifiedCount === 1?res.statusCode:404;
                res.json({ status: res.statusCode,
                    message:updated.modifiedCount === 1? "Comment successfully updated": "Comment not found or no changes made",
                    data: updated.modifiedCount === 1? updated: "Comment not found or no changes made"});
            }catch (error){
                res.statusCode = error.statusCode;
                res.json({ status: error.statusCode, message: "Failed to update comment", data: error.message})
            }
            break;
        case "GET":
            try{
                const dbComment = await db.collection("comments").findOne({ _id : new ObjectId(id) });
                res.statusCode = dbComment?res.statusCode:404;
                res.json({ status: res.statusCode,
                    message: dbComment? "Comment found and returned" : "Comment not found",
                    data: {comment: dbComment? dbComment : "Comment not found"} });
            }catch (error){
                res.statusCode = error.statusCode;
                res.json({ status: error.statusCode,message: "Internal server error", data: error.message})
            }
            break;
        case "DELETE":
            try{
                const deleted = await db.collection("comments")
                    .deleteOne({_id: new ObjectId(id)});
                res.statusCode = deleted.deletedCount === 1 ?res.statusCode:404;
                res.json({ status: res.statusCode,
                    message: deleted.deletedCount === 1 ?"Comment successfully deleted": "Comment not found, can't proceed deletion",
                    data: deleted.deletedCount === 1 ? deleted : "Comment not found, can't proceed deletion" });
            }catch (error){
                res.statusCode = error.statusCode;
                res.json({ status: error.statusCode, message: "Failed to delete comment", data: error.message})
            }
            break;
    }

};

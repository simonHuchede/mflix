import clientPromise from "../../../../lib/mongodb";
import {ObjectId} from "mongodb";

/**
  * @swagger
  * /api/movie/{id}/comments:
  *   get:
  *     tags: [Comments]
  *     description: Retrieves a movie comments
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: The ID of the movie to retrieve comments for
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: Movie comments returned
  *       404:
  *         description: No comments found for this movie
  *       500:
  *         description: Server error while retrieving comments
  *   post:
  *     tags: [Comment]
  *     description: Posts a new comment for a specified movie by ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: The ID of the movie to post a comment for
  *         schema:
  *           type: string
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
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
  *                 example: "2024-02-28T04:56:07.000Z"
  *             required:
  *               - name
  *               - text
  *               - movie_id
  *               - email
  *     responses:
  *       201:
  *         description: Comment added
  *       404:
  *         description: Bad movie Id, can't add the comment
  *       500:
  *         description: Failed to add comment
 */

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const { id } = req.query;
    const payload = req.body;
    switch (req.method) {
        case "POST":
            try{
                const created = await db.collection("comments").insertOne(payload);
                res.statusCode = created.insertedId?201: 404;
                res.json({status: res.statusCode,
                    message: created.insertedId?"Comment added":"Bad movie Id, can't add the comment",
                    data: created.insertedId? created : "Bad movie Id, can't add the comment"})
            }catch (error){
                res.statusCode = error.statusCode;
                res.json({ status:error.statusCode, message: "Failed to add comment", data:error})
            }
        case "GET":
            try {
                const comments = await db.collection("comments").find({movie_id: new ObjectId(id)})
                    .limit(10).toArray();
                res.statusCode = comments.length === 0?404:res.statusCode;
                res.json({ status: res.statusCode,
                    message: comments.length === 0?"No comments found for this movie":"Movie comments returned",
                    data: comments.length === 0?"No comments found for this movie":comments });
            }catch (error){
                res.statusCode = error.statusCode;
                res.json({status: error.statusCode,message: "Server error while retrieving comments", data: error.message})
            }

    }
}
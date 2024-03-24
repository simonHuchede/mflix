import clientPromise from "../../../lib/mongodb";
import {ObjectId} from "mongodb";

/**
  * @swagger
  * tags:
  *   - name: Movie
  *     description: Everything about specific Movie
  *   - name: Movies
  *     description: General movies
  *   - name: Comments
  *     description: General Comments
  *   - name: Comment
  *     description: Everything about specific comment
 */

/**
  * @swagger
  * /api/movie/{id}:
  *   get:
  *     tags: [Movie]
  *     summary: Retrieve a movie by its ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The movie ID
  *     responses:
  *       200:
  *         description: Movie returned
  *       404:
  *         description: Movie not found
  *       500:
  *         description: Internal server error
  *   delete:
  *     tags: [Movie]
  *     summary: Delete a movie by its ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The movie ID
  *     responses:
  *       200:
  *         description: Movie successfully deleted
  *       404:
  *         description: Movie not found, can't proceed deletion
  *       500:
  *         description: Failed to delete movie
  *   put:
  *     tags: [Movie]
  *     summary: Update a movie by its ID
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The movie ID
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               _id:
  *                 type: string
  *               plot:
  *                 type: string
  *               genres:
  *                 type: array
  *                 items:
  *                   type: string
  *               runtime:
  *                 type: integer
  *               cast:
  *                 type: array
  *                 items:
  *                   type: string
  *               poster:
  *                 type: string
  *                 format: uri
  *               title:
  *                 type: string
  *               fullplot:
  *                 type: string
  *               languages:
  *                 type: array
  *                 items:
  *                   type: string
  *               released:
  *                 type: string
  *                 format: date-time
  *               directors:
  *                 type: array
  *                 items:
  *                   type: string
  *               rated:
  *                 type: string
  *               awards:
  *                 type: object
  *                 properties:
  *                   wins:
  *                     type: integer
  *                   nominations:
  *                     type: integer
  *                   text:
  *                     type: string
  *               lastupdated:
  *                 type: string
  *                 format: date-time
  *               year:
  *                 type: integer
  *               imdb:
  *                 type: object
  *                 properties:
  *                   rating:
  *                     type: number
  *                   votes:
  *                     type: integer
  *                   id:
  *                     type: integer
  *               countries:
  *                 type: array
  *                 items:
  *                   type: string
  *               type:
  *                 type: string
  *               tomatoes:
  *                 type: object
  *                 properties:
  *                   viewer:
  *                     type: object
  *                     properties:
  *                       rating:
  *                         type: number
  *                       numReviews:
  *                         type: integer
  *                       meter:
  *                         type: integer
  *                   fresh:
  *                     type: integer
  *                   critic:
  *                     type: object
  *                     properties:
  *                       rating:
  *                         type: number
  *                       numReviews:
  *                         type: integer
  *                       meter:
  *                         type: integer
  *                   rotten:
  *                     type: integer
  *               num_mflix_comments:
  *                 type: integer
  *     responses:
  *       200:
  *         description: Movie successfully updated
  *       404:
  *         description: Couldn't process update on movie
  *       500:
  *         description: Failed to update movie
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
                const updated = await db.collection("movies")
                    .updateOne({_id: new ObjectId(id)}, {$set: payload});
                res.statusCode = updated.modifiedCount === 1?200: 404;
                res.json({ status: res.statusCode,
                    message: updated.modifiedCount === 1? "Movie updated": "Couldn't process update on movie",
                    data: updated.modifiedCount === 1? "Movie updated" : "Couldn't process update on movie"});
            }catch (error){
                res.statusCode(error.statusCode);
                res.json({ status: error.statusCode, message: "Failed to update movie", data: error.message})
            }
            break;
        case "GET":
            try{
                const dbMovie = await db.collection("movies").findOne({ _id : new ObjectId(id) });
                res.statusCode =dbMovie?200: 404;
                res.json({ status: res.statusCode,
                    message: dbMovie?"Movie returned":"No match found",
                    data: {movie: dbMovie? dbMovie : "No match found"} });
            }catch (error){
                res.statusCode = error.statusCode;
                res.json({ status: error.statusCode, message: "Internal server error", data: error.message})
            }
            break;
        case "DELETE":
            try{
                const deleted = await db.collection("movies")
                    .deleteOne({_id: new ObjectId(id)});
                res.statusCode = deleted.deletedCount === 1?200: 404;
                res.json({ status: res.statusCode,
                    message: deleted.deletedCount === 1? "Movie successfully deleted": "Movie not found, can't proceed deletion",
                    data: deleted.deletedCount === 1? deleted : "Movie not found, can't proceed deletion"});
            }catch (error){
                res.statusCode = error.statusCode;
                res.json({ status: error.statusCode, message: "Failed to delete movie", data: error.message})
            }
            break;
    }

};

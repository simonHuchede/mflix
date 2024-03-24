import clientPromise from "../../lib/mongodb";
/**
  * @swagger
  * /api/movies:
  *   get:
  *     tags: [Movies]
  *     description: Returns movies
  *     responses:
  *       200:
  *         description: Movies list
  *       500:
  *         description: Internal server error
  *   post:
  *     tags: [Movie]
  *     summary: Add a new movie
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               plot:
  *                 type: string
  *                 description: Description du film
  *               genres:
  *                 type: array
  *                 items:
  *                   type: string
  *                 description: Liste des genres du film
  *               runtime:
  *                 type: integer
  *                 description: Durée du film en minutes
  *               cast:
  *                 type: array
  *                 items:
  *                   type: string
  *                 description: Liste des acteurs principaux du film
  *               poster:
  *                 type: string
  *                 format: uri
  *                 description: URL du poster du film
  *               title:
  *                 type: string
  *                 description: Titre du film
  *               fullplot:
  *                 type: string
  *                 description: Synopsis complet du film
  *               languages:
  *                 type: array
  *                 items:
  *                   type: string
  *                 description: Liste des langues du film
  *               released:
  *                 type: string
  *                 format: date-time
  *                 description: Date de sortie du film
  *               directors:
  *                 type: array
  *                 items:
  *                   type: string
  *                 description: Liste des réalisateurs du film
  *               rated:
  *                 type: string
  *                 description: Classification du film
  *               awards:
  *                 type: object
  *                 properties:
  *                   wins:
  *                     type: integer
  *                     description: Nombre de prix remportés par le film
  *                   nominations:
  *                     type: integer
  *                     description: Nombre de nominations reçues par le film
  *                   text:
  *                     type: string
  *                     description: Texte des prix remportés par le film
  *               lastupdated:
  *                 type: string
  *                 format: date-time
  *                 description: Date de la dernière mise à jour du film
  *               year:
  *                 type: integer
  *                 description: Année de sortie du film
  *               imdb:
  *                 type: object
  *                 properties:
  *                   rating:
  *                     type: number
  *                     description: Note IMDb du film
  *                   votes:
  *                     type: integer
  *                     description: Nombre de votes IMDb du film
  *                   id:
  *                     type: integer
  *                     description: Identifiant IMDb du film
  *               countries:
  *                 type: array
  *                 items:
  *                   type: string
  *                 description: Liste des pays de production du film
  *               type:
  *                 type: string
  *                 description: Type de film
  *               tomatoes:
  *                 type: object
  *                 properties:
  *                   viewer:
  *                     type: object
  *                     properties:
  *                       rating:
  *                         type: number
  *                         description: Note moyenne des spectateurs
  *                       numReviews:
  *                         type: integer
  *                         description: Nombre de critiques des spectateurs
  *                       meter:
  *                         type: integer
  *                         description: Pourcentage de notes positives des spectateurs
  *                   fresh:
  *                     type: integer
  *                     description: Nombre de critiques positives
  *                   critic:
  *                     type: object
  *                     properties:
  *                       rating:
  *                         type: number
  *                         description: Note moyenne des critiques
  *                       numReviews:
  *                         type: integer
  *                         description: Nombre de critiques professionnelles
  *                       meter:
  *                         type: integer
  *                         description: Pourcentage de notes positives des critiques
  *                   rotten:
  *                     type: integer
  *                     description: Nombre de critiques négatives
  *               num_mflix_comments:
  *                 type: integer
  *                 description: Nombre de commentaires sur le film sur MFlix
  *     responses:
  *       201:
  *         description: Movie added
  *       500:
  *         description: Failed to add movie
 */
export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const payload = req.body;
    switch (req.method) {
        case "POST":
            try{
                const created = await db.collection("movies").insertOne(payload);
                res.json({status: 201, message: "Movie added", data: created})
            }catch (error){
                res.statusCode =error.statusCode;
                res.json({ status:error.statusCode, message: "Failed to add movie", data:error})
        }
        case "GET":
            try {
                const movies = await db.collection("movies").find({}).limit(10).toArray();
                res.statusCode(200);
                res.json({ status: res.statusCode, message: "Movies list", data: movies });
            }catch (error){
                res.statusCode = error.statusCode;
                res.json({status: error.statusCode , message: "Internal server error", data: error.message})
            }

    }
}
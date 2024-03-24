import { withSwagger } from "next-swagger-doc";
const swaggerHandler = withSwagger({
    openApiVersion: "3.0.0",
    title: "Movies API",
    version: "1.0.0",
    description: 'Api permettant de consulter/mettre à jour des films présents dans notre base de données ainsi que les' +
        ' commentaire qui y sont associés.',
    apiFolder: "pages/api",
});
export default swaggerHandler();
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dbpool } from "../Databases/dbconnection.js";
import { ApiError } from "../Helpers/apierror.js";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDBschemas() {
    try {
        const schemaPath = path.join(__dirname, "../Schemas/user_schema.sql");
        const schema = await fs.readFile(schemaPath, "utf-8");
        await dbpool.promise().query(schema);
        console.log("Schema loaded successfully");
    } catch (err) {
        console.log(err);
        throw new ApiError(500, "Error initializing database schemas");
    }
}

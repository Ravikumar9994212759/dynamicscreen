// import { Pool } from 'pg';

// // Create a pool instead of a single client to efficiently manage multiple connections
// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// export const getFormFields = async (primaryKey = 1) => {
//   try {
//     const query = `
//       SELECT 
//         field->>'name' AS name,
//         field->>'label' AS label,
//         field->>'limit' AS limit,
//         field->>'dataType' AS dataType,
//         field->>'gridShow' AS gridShow,
//         field->>'inputType' AS inputType
//       FROM 
//         inventoryMaster,
//         LATERAL jsonb_array_elements(gridDesign->'fields') AS field
//       WHERE 
//         nprimarykey = $1
//       ORDER BY 
//         field->>'name';
//     `;

//     // Execute the query with the primary key
//     const { rows } = await pool.query(query, [primaryKey]);

//     // Check if rows were returned and handle accordingly
//     if (rows.length === 0) {
//       console.warn(`No form fields found for the primary key: ${primaryKey}`);
//       return [];  // Return an empty array if no data is found
//     }

//     // Format or transform data if necessary before returning
//     // For instance, if you need to convert certain values into more usable formats
//     return rows;

//   } catch (error) {
//     console.error('Error fetching form fields:', error);
//     // You can throw a more descriptive error or rethrow the original error
//     throw new Error('Failed to fetch form fields from database');
//   }
// };

// // No need to call pool.end() unless shutting down the application
// // pool.end(); // Uncomment this if you're closing the pool manually when the application shuts down

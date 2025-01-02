// pages/api/users.js
import { getFormFields  } from '../../lib/POSTGRESdb';


export default async function handler(req, res) {
  try {
    const fields = await getFormFields(); // Call your function to get the fields from the DB
    res.status(200).json(fields); // Send the data as a JSON response
  } catch (error) {
    console.error('Error fetching form fields:', error);
    res.status(500).json({ error: 'Failed to fetch form fields' });
  }
}

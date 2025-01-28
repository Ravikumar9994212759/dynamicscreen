// pages/api/materials.js

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const requestBody = {
        field1: 'value1',
        field2: 'value2',
      };

      const response = await fetch('http://localhost:9356/QuaLIS/invoicecustomermaster/getmaterialsdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestData: requestBody }),
      });

      const data = await response.json();

      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json({ message: 'Failed to fetch data' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

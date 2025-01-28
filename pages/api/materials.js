// pages/api/materials.js

export default async function handler(req, res) {
    console.log("call initiated");  
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

  } 
  else if (req.method === 'POST') {
    console.log("call post initiated"); 
    try {
      console.log('Received POST request at /api/materials');
      console.log('Request body:', req.body); 
  
      const newMaterial = req.body.newMaterial; 
      console.log('Extracted newMaterial:', newMaterial);
  
      const response = await fetch('http://localhost:9356/QuaLIS/invoicecustomermaster/createMaterial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newMaterial: newMaterial }),  
      });
  
      if (response.ok) {
        const createdData = await response.json();
        res.status(201).json(createdData);
      } else {
        res.status(response.status).json({ message: 'Failed to add material' });
      }
    } catch (error) {
      console.error('Error in POST handler:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
   else if (req.method === 'PUT') {
    try {
      const { id, data } = req.body;  

      const response = await fetch(`${'http://localhost:9356/QuaLIS/invoicecustomermaster/updatematerialsdata'}/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedMaterial: data }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        res.status(200).json(updatedData);  
      } else {
        res.status(response.status).json({ message: 'Failed to update material' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  } else if (req.method === 'DELETE1') {
    try {
      const { id } = req.body;  

      const response = await fetch(`${'http://localhost:9356/QuaLIS/invoicecustomermaster/deletematerialsdata'}/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        res.status(200).json({ message: 'Material deleted successfully' });
      } else {
        res.status(response.status).json({ message: 'Failed to delete material' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

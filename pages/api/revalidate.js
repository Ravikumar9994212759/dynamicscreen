// pages/api/revalidate.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { path } = req.body; // No secret verification

      // Trigger revalidation for the specified path
      await res.revalidate(path);

      return res.json({ revalidated: true });
    } catch (error) {
      return res.status(500).json({ message: 'Error revalidating', error });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

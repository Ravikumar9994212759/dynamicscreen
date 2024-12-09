// pages/api/revalidate.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { slug } = req.body; // Get the 'slug' (which is the primary key, 'nprimarykey')
  
      if (!slug) {
        return res.status(400).json({ message: 'Slug is required' });
      }
  
      try {
        // Revalidate the page for /nested/[slug] URL
        const revalidatePath = `/nested/?slug=${slug}`;
        console.log(`Revalidating path: ${revalidatePath}`);
  
        // Trigger revalidation for the page associated with the slug
        await res.revalidate(revalidatePath);
  
        return res.json({ message: `Revalidated ${revalidatePath}` });
      } catch (err) {
        console.error("Error during revalidation:", err);
        return res.status(500).json({ message: `Error revalidating: ${err.message}` });
      }
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  
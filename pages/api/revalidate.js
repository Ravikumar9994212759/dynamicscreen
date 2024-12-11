export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { slug } = req.body;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing slug' });
    }

    try {
      // Ensure the URL is properly formatted with a trailing slash
      const revalidatePath = `/nested/${slug.replace(/\/$/, '')}/`; // Remove any extra slashes
      console.log(`Revalidating path: ${revalidatePath}`);
      
      // Trigger revalidation for the page
      await res.unstable_revalidate(revalidatePath);
      return res.json({ message: `Revalidated ${revalidatePath}` });
    } catch (err) {
      console.error('Error during revalidation:', err);
      return res.status(500).json({ message: `Error revalidating: ${err.message}` });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

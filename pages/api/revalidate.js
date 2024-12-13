export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { slug } = req.body;

    // Log the incoming request for debugging
    console.log('Received revalidation request:', req.body);

    if (!slug || typeof slug !== 'string') {
      console.error('Invalid or missing slug:', slug);
      return res.status(400).json({ message: 'Invalid or missing slug' });
    }

    try {
      // Ensure the URL is properly formatted with a trailing slash
      const revalidatePath = `/nested/${slug.replace(/\/$/, '')}/`; // Remove any extra slashes
      console.log(`Revalidating path: ${revalidatePath}`); // Log revalidation process

      // Trigger revalidation for the page
      if (process.env.NODE_ENV === 'production') {
        // In production (e.g., Vercel), use the stable revalidation method
        await res.revalidate(revalidatePath); // Use stable revalidate
        console.log(`Successfully revalidated ${revalidatePath}`);
      } else {
        // For local development, the stable method will now work
        await res.revalidate(revalidatePath); // Also use the stable method here
        console.log(`Successfully revalidated ${revalidatePath} in development mode`);
      }

      return res.json({ message: `Revalidated ${revalidatePath}` });
    } catch (err) {
      console.error('Error during revalidation:', err);
      return res.status(500).json({ message: `Error revalidating: ${err.message}` });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

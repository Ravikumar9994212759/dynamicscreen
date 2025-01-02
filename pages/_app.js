import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css'; // Your global styles
import Layout from './../components/Layout'; // Assuming this is your layout component

// Syncfusion Styles
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-calendars/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import '@syncfusion/ej2-react-grids/styles/material.css';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle route changes to show the loader
  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
      document.getElementById('loader').style.display = 'block'; // Show loader
    };

    const handleRouteComplete = () => {
      setLoading(false);
      document.getElementById('loader').style.display = 'none'; // Hide loader
    };

    const handleRouteError = () => {
      setLoading(false);
      document.getElementById('loader').style.display = 'none'; // Hide loader on error
    };

    // Subscribe to route change events
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    router.events.on('routeChangeError', handleRouteError);

    // Clean up event listeners on unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
      router.events.off('routeChangeError', handleRouteError);
    };
  }, [router]);

  return (
    <Layout>
      {/* Loader element */}
      <div id="loader" style={{ display: 'none', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        Loading...
      </div>

      {/* Main content */}
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

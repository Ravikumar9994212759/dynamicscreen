import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';  // Import Next.js Head component
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
import '@syncfusion/ej2-react-lists/styles/material.css'; // Add the style for ListView

// Syncfusion Localization
import { L10n, setCulture, setCurrencyCode, loadCldr } from '@syncfusion/ej2-base';
import frFRLocalization from '../components/locale.json'; 
import cagregorian from '../components/ca-gregorian.json';
import currencies from '../components/currencies.json';
import numbers from '../components/numbers.json';
import timeZoneNames from '../components/timeZoneNames.json';
import numberingSystems from '../components/numberingSystems.json';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    // Syncfusion localization setup
    const setupLocalization = () => {
      setCulture('fr-FR');
      setCurrencyCode('EUR'); // Set currency to Euro for French locale

      // Load Syncfusion's calendar and number data (required for full localization support)
      loadCldr(
        cagregorian,
        currencies,
        numbers,
        timeZoneNames,
        numberingSystems
      );

      L10n.load({
        'fr-FR': frFRLocalization['fr-FR'],
      });

      console.log('Syncfusion French localization applied.');
    };

    setupLocalization();

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
    <>
      <Head>
        {/* Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        <meta name="description" content="Essential JS 2 for React Components" />
        <meta name="author" content="Syncfusion" />
      </Head>

      <Layout>
        {/* Loader element */}
        <div
          id="loader"
          style={{
            display: 'none',
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          Loading1...
        </div>

        {/* Main content */}
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;

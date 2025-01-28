import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script'; // Import Next.js Script component

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Syncfusion CSS styles are already included in _app.js, so remove from _document.js */}
          
          {/* Custom Loader Styles */}
          <style>{`
            #loader {
              color: #008cff;
              height: 40px;
              left: 45%;
              position: absolute;
              top: 45%;
              width: 30%;
              font-size: 20px;
            }
          `}</style>
        </Head>

        <body>
          {/* Loader HTML */}
          {/* <div id="element" style={{ margin: '0 auto', maxWidth: '400px' }} >
            <div id="loader">Loading....</div>
          </div> */}

          {/* Render the page content */}
          <Main />

          {/* Next.js scripts */}
          <NextScript />

          {/* External Syncfusion Scripts with Next.js Script component */}
          <Script
            src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.19.38/system.js"
            strategy="beforeInteractive" // Ensure this loads before interactive components
          />
          <Script
            src="/systemjs.config.js"  // Ensure this file is in your public folder
            strategy="beforeInteractive" // Load before any interaction
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

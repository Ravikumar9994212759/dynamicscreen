import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Syncfusion CSS styles */}
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-react-lists/styles/material.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-base/styles/material.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-layouts/styles/material.css"
            rel="stylesheet"
          />
          <link href="index.css" rel="stylesheet" />

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

          {/* External Syncfusion Scripts */}
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.19.38/system.js"
            strategy="beforeInteractive"
          ></script>
          <script
            src="/systemjs.config.js"  // Ensure this file is in your public folder
            strategy="beforeInteractive"
          ></script>
        </Head>

        <body>
          {/* Loader HTML */}
          {/* <div id="element" style={{ margin: '0 auto', maxWidth: '400px' }}>
            <div id="loader">Loading....</div>
          </div> */}

          {/* Render the page content */}
          <Main />
          
          {/* Next.js scripts */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

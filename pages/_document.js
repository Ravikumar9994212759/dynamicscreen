import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Syncfusion CSS styles */}
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-react-grids/styles/material.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-react-buttons/styles/material.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-react-popups/styles/material.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-react-navigations/styles/material.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-react-dropdowns/styles/material.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-react-lists/styles/material.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-react-inputs/styles/material.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-react-calendars/styles/material.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-base/styles/material.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-react-splitbuttons/styles/material.css"
            rel="stylesheet"
          />

          {/* Bootstrap CSS */}
          <link
            href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
            rel="stylesheet"
          />

          {/* Loader Styles */}
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
          {/* Add loader to the body */}
          <div id="loader">Loading....</div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

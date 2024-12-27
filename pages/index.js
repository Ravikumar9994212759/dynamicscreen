// pages/index.js
import NormalEdit from '../components/NormalEdit';
import { registerLicense } from '@syncfusion/ej2-base';

// registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf0x0R3xbf1x1ZFRMZV9bQHNPMyBoS35RckRhW3xecXFWQ2JdWUFw'); 
registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH1cc3RTRWFYVkV0W0c=');
export default function Home() {
  return (
    <div>
      <h1>Syncfusion DataGrid in Next.js</h1>
      <NormalEdit />
    </div>
  );
}

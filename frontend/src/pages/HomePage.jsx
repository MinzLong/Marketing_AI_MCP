import DarkVeil from '../components/common/DarkVeil.jsx';
import '../styles/DarkVeil.css';

export default function HomePage() {

  return (
    <div className='home-page-container'>
      <DarkVeil
        hueShift={0}
        noiseIntensity={0}
        scanlineIntensity={0}
        speed={0.5}
        scanlineFrequency={0}
        warpAmount={0}
      />
    </div>
  );
}
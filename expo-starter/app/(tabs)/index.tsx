import { AppKitProvider } from '../../src/AppKitProvider';
import { SnowPay } from '../../src/pages/SnowPay';

export default function HomeScreen() {
  return (
    <AppKitProvider>
      <SnowPay />
    </AppKitProvider>
  );
}
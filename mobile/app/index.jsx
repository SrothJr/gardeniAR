// mobile/app/index.jsx
import { Redirect } from 'expo-router';

// Redirect root "/" to "/explore"
export default function Index() {
  return <Redirect href="/explore" />;
}

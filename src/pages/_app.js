import "@/styles/globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import Font Awesome CSS
import { config } from '@fortawesome/fontawesome-svg-core';

// Prevent Font Awesome from adding its CSS automatically (Next.js handles this)
config.autoAddCss = false;
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

import { AppContextWrapper } from '../shared/context';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <AppContextWrapper>
      <Component {...pageProps} />
    </AppContextWrapper>
  );
};

export default MyApp;

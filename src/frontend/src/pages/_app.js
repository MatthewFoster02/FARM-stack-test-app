import '@/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function App({ Component, pageProps }) {
    return (
        <div className='flex flex-col justify-between items-stretch min-h-screen'>
            <Header />
            <div className='flex-1'>
                <Component {...pageProps} />
            </div>
            <Footer />
        </div>
    )
}

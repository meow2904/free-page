'use client';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
export default function Home() {
    const t = useTranslations();
    return (
        // <button className="border border-t-black"
        //     onClick={() => toast.success(t('welcome'))}>
        //     {/*{t('welcome')}*/}
        //     h1h1
        // </button>

        <div>
            <p className="text-sm">This is a glass effect like Apple's UI</p>
        </div>
    );
}

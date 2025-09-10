'use client';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import TestPage from "@/components/pages/test";
export default function Home() {
    const t = useTranslations();
    return (
        <div className=" text-center h-screen flex items-center justify-center flex-col">
            <p className="text-sm p-5">{t('welcome')}</p>
            <p className="text-sm">This is a glass effect like Apple's UI</p>
            <button className="border border-t-black"
                onClick={() => toast.success(t('welcome'))}>
                Toast Tester
            </button>
            <TestPage></TestPage>
        </div>
    );
}

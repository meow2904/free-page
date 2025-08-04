export const defaultLocale = 'vi';

export const locales = ['vi', 'en'];

export const getMessages = async (locale: string) => {
    try {
        return (await import(`./${locale}/common.json`)).default;
    } catch {
        return (await import(`./${defaultLocale}/common.json`)).default;
    }
};

const  Footer = ()=> {
    return (
        <footer className="text-sm md:text-lg row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-zinc-600 p-4">
            © {new Date().getFullYear()} Dinh Huy. All rights reserved.
        </footer>
    )
}
export default Footer;
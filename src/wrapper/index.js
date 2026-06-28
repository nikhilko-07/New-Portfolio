import Navbar from "../components/Navbar";

export default function Wrapper({ children, activeIndex, setActiveIndex }) {
    return (
        <>
            <Navbar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            {children}
        </>
    );
}
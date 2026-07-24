import style from "./style.module.css";

export default function Navbar({ activeIndex, setActiveIndex }) {
  const navItems = [
    { label: "Home", index: 0 },
    { label: "About", index: 1 },
    { label: "Skills", index: 2 },
    { label: "Projects", index: 3 },
    { label: "Contact", index: 4 },
  ];

  return (
    <div className={style.container}>
      <div className={style.logo} onClick={() => setActiveIndex && setActiveIndex(0)}>
        <h1>NK</h1>
      </div>
      <div className={style.btns}>
        {navItems.map((item) => (
          <button
            key={item.index}
            className={`${style.btn} ${activeIndex === item.index ? style.activeBtn : ""}`}
            onClick={() => setActiveIndex && setActiveIndex(item.index)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
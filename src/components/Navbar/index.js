import style from "./style.module.css";

export default function Navbar({ setActiveIndex }) {
  return (
    <div className={style.container}>
      <div className={style.logo} onClick={() => setActiveIndex && setActiveIndex(0)}>
        <h1>NK</h1>
      </div>
    </div>
  );
}
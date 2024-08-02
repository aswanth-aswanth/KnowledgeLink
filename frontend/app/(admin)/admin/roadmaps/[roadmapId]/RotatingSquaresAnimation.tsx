import styles from "./RotatingSquaresAnimation.module.css";

const RotatingSquaresAnimation = () => (
  <div className={styles.container}>
    {[0, 1, 2, 3].map((index) => (
      <div
        key={index}
        className={`${styles.square} ${styles[`square${index}`]}`}
      />
    ))}
  </div>
);

export default RotatingSquaresAnimation;

import styles from "./signInButton.module.css";

type SignInButtonProps = {
  onClick?: () => void;
};

export function SignInButton({ onClick }: SignInButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      로그인
    </button>
  );
}

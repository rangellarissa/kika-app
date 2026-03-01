import { useNavigate } from "react-router-dom";
import './back-button.scss';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
        className="back-button"
        onClick={() => navigate("/")}
    >
        <span>←</span>
    </button>
  );
}
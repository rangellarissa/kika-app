import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  fallback?: string;
}

const BackButton = ({
  fallback = "/",
}: BackButtonProps) => {

  const navigate = useNavigate();

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }

  return (
    <button
        className="back-button"
        onClick={handleBack}
    >
        <span>←</span>
    </button>
  );
};

export default BackButton;
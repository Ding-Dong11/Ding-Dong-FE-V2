import mascotFrontImg from "../img/duck1.png"; // 정면 포즈 (pose="front")
import mascotPeekImg from "../img/duck2.png";  // 빼꼼 포즈 (pose="peek")

type Props = {
  className?: string;
  pose?: "front" | "peek";
};

export default function Mascot({ className = "", pose = "front" }: Props) {
  if (pose === "peek") {
    return (
      <img 
        src={mascotPeekImg} 
        alt="띵동 마스코트 뒤집어짐" 
        className={className} 
      />
    );
  }

  return (
    <img 
      src={mascotFrontImg} 
      alt="띵동 마스코트 정면" 
      className={className} 
    />
  );
}
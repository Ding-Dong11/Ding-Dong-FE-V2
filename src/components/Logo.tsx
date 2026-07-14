import logoImg from "../img/logo.svg"; // 상위 폴더 구조에 맞춰 img 폴더의 1.png를 가져옵니다.

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <img 
      src={logoImg} 
      alt="띵동" 
      className={className} 
    />
  );
}
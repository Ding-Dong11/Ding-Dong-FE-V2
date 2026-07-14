import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, rewardsApi } from "../api";
import PageHeader from "../components/PageHeader";

// 별도 QR 디코딩 라이브러리 없이, 지원 브라우저(Chrome 계열)에 내장된 BarcodeDetector Web API를 사용한다.
type DetectedBarcode = { rawValue: string };
type BarcodeDetectorLike = {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
};
type BarcodeDetectorConstructor = new (options?: {
  formats?: string[];
}) => BarcodeDetectorLike;

// QR에는 `dingdong://verify?token=<UUID>` 형식의 URL이 인코딩되어 있다.
function extractToken(raw: string): string | null {
  const match = raw.match(/token=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function QrScan() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const busyRef = useRef(false);
  const [supported] = useState(
    () => typeof window !== "undefined" && "BarcodeDetector" in window
  );
  const [error, setError] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [verifying, setVerifying] = useState(false);

  const verify = async (token: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setVerifying(true);
    setError("");
    try {
      const res = await rewardsApi.verifyQr({ qr_token: token });
      navigate("/map", {
        state: {
          visited: true,
          awardedPoint: res.awarded_point,
          storeName: res.store_name,
        },
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "QR 인증에 실패했습니다.");
      setVerifying(false);
      // 같은 QR을 계속 비추고 있어도 곧바로 재요청하지 않도록 잠깐 쉬었다 재시도
      setTimeout(() => {
        busyRef.current = false;
      }, 2000);
    }
  };

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const Detector = (
          window as unknown as { BarcodeDetector: BarcodeDetectorConstructor }
        ).BarcodeDetector;
        const detector = new Detector({ formats: ["qr_code"] });

        const tick = async () => {
          if (cancelled) return;
          if (
            !busyRef.current &&
            videoRef.current &&
            videoRef.current.readyState >= 2
          ) {
            try {
              const codes = await detector.detect(videoRef.current);
              const token =
                codes.length > 0 ? extractToken(codes[0].rawValue) : null;
              if (token) verify(token);
            } catch {
              // 프레임 디코딩 실패는 무시하고 다음 프레임에서 계속 시도
            }
          }
          frameRef.current = requestAnimationFrame(tick);
        };
        frameRef.current = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) {
          setError("카메라를 사용할 수 없습니다. 권한을 확인해주세요.");
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [supported]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title="방문 확인" />
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center bg-neutral-900 px-8">
        {supported && (
          <video
            ref={videoRef}
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        )}
        <div className="relative aspect-square w-64">
          <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-2xl border-l-4 border-t-4 border-white" />
          <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-2xl border-r-4 border-t-4 border-white" />
          <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-white" />
          <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-2xl border-b-4 border-r-4 border-white" />
          {!verifying && (
            <span className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-primary/80" />
          )}
        </div>
        <p className="relative mt-10 text-center text-lg font-medium leading-8 text-white">
          {verifying ? (
            "인증 중입니다..."
          ) : supported ? (
            <>
              방문한 가게에 있는
              <br />
              QR을 스캔해주세요!
            </>
          ) : (
            "이 브라우저는 카메라 QR 스캔을 지원하지 않아요."
          )}
        </p>
        {error && (
          <p className="relative mt-3 text-center text-sm text-danger">{error}</p>
        )}

        {!supported && (
          <div className="relative mt-6 flex w-full max-w-xs gap-2">
            <input
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="QR 토큰 직접 입력"
              className="h-12 min-w-0 flex-1 rounded-xl bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/50"
            />
            <button
              type="button"
              disabled={!manualToken || verifying}
              onClick={() => verify(extractToken(manualToken) ?? manualToken)}
              className="h-12 shrink-0 rounded-xl bg-primary px-4 text-base font-semibold text-white disabled:opacity-60"
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import Lottie, { LottieRefApi } from "lottie-react";
import { useRef, useEffect } from "react";

// Animations
const x = null

export function Icon({
    src = "",
    size = "w-6 h-6",
    color = "bg-c-text",
    className = ""
}) {
    return (
        <div
            className={`${size} ${color} inline-block ${className}`}
            style={{
                WebkitMask: `url('${src}') no-repeat center / contain`,
                mask: `url('${src}') no-repeat center / contain`
            }}
        />
    );
}

export const FolderAnimation = ({ isPressed }: { isPressed: boolean }) => {
    const lottieRef = useRef<LottieRefApi>(null);

    useEffect(() => {
        if (isPressed) {
            // .play() only works if not at the end. 
            // .goToAndPlay(0) resets the animation to the start and plays it immediately.
            lottieRef.current?.goToAndPlay(0);
        } else {
            // Optional: If you want it to snap back to the closed state when letting go:
            // lottieRef.current?.stop(); 

            // If you want it to just stay where it ended:
            lottieRef.current?.pause();
            lottieRef.current?.goToAndStop(0);
        }
    }, [isPressed]);

    return (
        <div className="w-5 h-5 flex items-center justify-center pointer-events-none">
            <Lottie
                lottieRef={lottieRef}
                animationData={x}
                loop={false}
                autoplay={false}
                className="lottie-theme"
            />
        </div>
    );
};
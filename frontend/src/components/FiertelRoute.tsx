import { useEffect, useRef, useState } from "react";
import { routePath } from "../data/route";

interface FiertelRouteProps {
  progress: number;
}

function FiertelRoute({ progress }: FiertelRouteProps) {
  const routeRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (routeRef.current) {
      setPathLength(routeRef.current.getTotalLength());
    }
  }, []);

  const safeProgress = Math.max(0, Math.min(progress, 1));

  return (
    <div className="fiertel-route">
      <svg
        viewBox="0 0 840.227112 345.6"
        role="img"
        aria-label="Route van de Fiertel">
        {/* Volledige route */}
        <path
          d={routePath}
          fill="none"
          stroke="#d1d5db"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Ingezamelde gedeelte */}
        <path
          ref={routeRef}
          d={routePath}
          fill="none"
          stroke="#3BA882"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - safeProgress)}
          style={{
            transition: "stroke-dashoffset 500ms ease",
          }}
        />
      </svg>
    </div>
  );
}

export default FiertelRoute;

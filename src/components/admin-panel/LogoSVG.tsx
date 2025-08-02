export function LogoSVG({
  color = "#000",
  size = 64, // aumentado para ainda mais definição
  shadow = false,
}: {
  color?: string;
  size?: number;
  shadow?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 469.779 469.778"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      shapeRendering="geometricPrecision"
      vectorEffect="non-scaling-stroke"
      style={{
        display: "block",
        filter: shadow
          ? "drop-shadow(0px 4px 12px rgba(0,0,0,0.12))"
          : undefined,
      }}
      aria-labelledby="logoTitle"
      role="img"
    >
      <title id="logoTitle">Logo GolData</title>
      <defs>
        <radialGradient id="grad1" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </radialGradient>
      </defs>
      <circle
        cx="333.664"
        cy="88.462"
        r="30.382"
        fill="url(#grad1)"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="36.08"
        cy="271.636"
        r="30.382"
        fill={color}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M288.64,248.42c20.245-9.201,48.962-44.683,69.096-72.189c34.235,52.66,69.938,116.163,70.899,131.219
          c-0.77,11.133,7.489,20.887,18.65,21.897c0.638,0.06,1.267,0.092,1.888,0.092c10.516,0,19.488-8.035,20.462-18.707
          c1.062-11.714-2.945-32.428-40.731-97.284c-19.833-34.055-39.646-64.191-40.479-65.457c-3.591-5.454-9.345-8.556-15.388-9.087
          l-63.931-22.885l-4.208-1.511l-1.611-0.571l-0.26,0.281c-0.91-0.125-1.824-0.281-2.781-0.281h-88.26
          c-11.361,0-20.57,9.207-20.57,20.568c0,11.359,9.209,20.566,20.57,20.566h53.423l-50.379,54.717l0.038,0.054l-60.304,54.479
          c-5.504,4.974-7.734,12.487-6.155,19.657L9.412,373.856c-9.536,6.164-12.285,18.892-6.121,28.429
          c3.933,6.096,10.542,9.414,17.292,9.414c3.825,0,7.686-1.059,11.13-3.29l160.902-103.885l123.106,20.883
          c1.166,0.2,2.324,0.292,3.466,0.292c9.843,0,18.547-7.101,20.254-17.128c1.903-11.192-5.643-21.82-16.843-23.72l-78.818-13.373
          l31.426-20.281C279.715,251.241,284.215,250.428,288.64,248.42z"
        fill={color}
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
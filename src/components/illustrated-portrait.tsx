import Image from "next/image";
import { portraitPathFor } from "@/data/portrait-registry";

type PortraitSpec = {
  skin: string;
  hair: string;
  jacket: string;
  hairStyle: "full" | "short" | "receding" | "bald" | "white";
  beard?: boolean;
  glasses?: boolean;
  eyepatch?: boolean;
};

const specs: Record<string, PortraitSpec> = {
  "ted-cruz": { skin: "#d7a17e", hair: "#2d211d", jacket: "#233b62", hairStyle: "short", beard: true },
  "dan-crenshaw": { skin: "#d3a17d", hair: "#3a2b25", jacket: "#1f3659", hairStyle: "short", eyepatch: true },
  "jared-huffman": { skin: "#d6ae8f", hair: "#9d8c77", jacket: "#2c4668", hairStyle: "receding" },
  "guy-reschenthaler": { skin: "#d2a27d", hair: "#4a3229", jacket: "#243c61", hairStyle: "short" },
  "al-franken": { skin: "#d8aa89", hair: "#a79a89", jacket: "#293f63", hairStyle: "receding", glasses: true },
  "trey-gowdy": { skin: "#d2a078", hair: "#b29f88", jacket: "#243957", hairStyle: "receding" },
  "jason-chaffetz": { skin: "#d7a67f", hair: "#40312b", jacket: "#223b61", hairStyle: "short" },
  "newt-gingrich": { skin: "#d7ad8b", hair: "#ddd6c9", jacket: "#273f65", hairStyle: "white", glasses: true },
  "doug-collins": { skin: "#d5a582", hair: "#6a584d", jacket: "#293f61", hairStyle: "short" },
  "joe-walsh": { skin: "#d5a37d", hair: "#aaa092", jacket: "#253d60", hairStyle: "receding" },
  "george-lemieux": { skin: "#d6a27e", hair: "#4a3329", jacket: "#243c60", hairStyle: "short" },
  "anthony-weiner": { skin: "#cf9d78", hair: "#342822", jacket: "#243c5f", hairStyle: "short" },
  "michael-d-brown": { skin: "#a66f4f", hair: "#33251f", jacket: "#243b5f", hairStyle: "short" },
};

function fallbackSpec(slug: string): PortraitSpec {
  const sum = [...slug].reduce((total, ch) => total + ch.charCodeAt(0), 0);
  const skins = ["#d7aa88", "#bd8767", "#9b6548", "#e0b697"];
  const hairs = ["#2f2521", "#554138", "#897765", "#d3c9ba"];
  return {
    skin: skins[sum % skins.length],
    hair: hairs[(sum >> 1) % hairs.length],
    jacket: ["#203858", "#293f63", "#314766"][sum % 3],
    hairStyle: (["full", "short", "receding"] as const)[sum % 3],
  };
}

export function IllustratedPortrait({
  slug,
  name,
  large = false,
}: {
  slug: string;
  name: string;
  large?: boolean;
}) {
  const portraitPath = portraitPathFor(slug);
  const spec = specs[slug] ?? fallbackSpec(slug);
  const sizeClass = large ? "illustrated-portrait illustrated-portrait-large" : "illustrated-portrait";

  if (portraitPath) {
    return (
      <div className={`${sizeClass} illustrated-portrait-photo`}>
        <Image
          src={portraitPath}
          alt={`Stylized editorial portrait of ${name}`}
          fill
          sizes={large ? "(max-width: 760px) 112px, 190px" : "128px"}
        />
        <span className="portrait-art-label">Editorial illustration</span>
      </div>
    );
  }

  return (
    <div className={sizeClass} role="img" aria-label={`Illustrated portrait of ${name}`}>
      <svg viewBox="0 0 240 300" aria-hidden="true">
        <defs>
          <linearGradient id={`bg-${slug}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#173252" />
            <stop offset="60%" stopColor="#0f2742" />
            <stop offset="100%" stopColor="#7b2530" />
          </linearGradient>
          <radialGradient id={`halo-${slug}`} cx="50%" cy="30%" r="58%">
            <stop offset="0%" stopColor="#f0d9a7" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#f0d9a7" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="240" height="300" fill={`url(#bg-${slug})`} />
        <rect width="240" height="300" fill={`url(#halo-${slug})`} />
        <circle cx="120" cy="104" r="76" fill="#f5e7c9" opacity="0.07" />

        <path d="M45 300 C52 229 78 205 120 202 C164 205 190 229 197 300 Z" fill={spec.jacket} />
        <path d="M83 300 L99 212 L120 231 L141 212 L158 300 Z" fill="#f4efe5" />
        <path d="M99 212 L120 231 L141 212 L132 204 L108 204 Z" fill="#d9d1c4" />
        <path d="M112 231 L128 231 L134 300 L106 300 Z" fill="#8a2832" />

        <rect x="102" y="176" width="36" height="42" rx="16" fill={spec.skin} />
        <ellipse cx="120" cy="126" rx="55" ry="69" fill={spec.skin} />
        <ellipse cx="65" cy="130" rx="9" ry="17" fill={spec.skin} />
        <ellipse cx="175" cy="130" rx="9" ry="17" fill={spec.skin} />

        {spec.hairStyle === "bald" ? null : spec.hairStyle === "receding" ? (
          <>
            <path d="M72 100 C78 58 100 47 120 48 C140 47 161 59 168 99 C150 83 139 78 120 80 C99 78 90 83 72 100 Z" fill={spec.hair} />
            <path d="M76 96 C76 76 82 64 91 56 C86 85 85 94 84 112 Z" fill={spec.hair} />
            <path d="M164 96 C164 76 158 64 149 56 C154 85 155 94 156 112 Z" fill={spec.hair} />
          </>
        ) : (
          <path d="M67 105 C71 58 92 39 121 40 C151 40 171 63 173 106 C157 90 145 82 121 81 C98 82 83 90 67 105 Z" fill={spec.hair} />
        )}

        <path d="M83 119 Q98 111 108 118" fill="none" stroke="#3b2d28" strokeWidth="4" strokeLinecap="round" />
        <path d="M132 118 Q143 111 157 119" fill="none" stroke="#3b2d28" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="98" cy="127" rx="4" ry="3" fill="#1f2329" />
        <ellipse cx="143" cy="127" rx="4" ry="3" fill="#1f2329" />
        <path d="M121 130 C116 145 116 151 122 155" fill="none" stroke="#9a664f" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 170 Q120 179 140 170" fill="none" stroke="#6d3d35" strokeWidth="3" strokeLinecap="round" />

        {spec.beard ? (
          <path d="M81 151 C84 190 102 203 120 204 C140 202 157 190 160 151 C149 177 139 187 120 189 C101 187 91 177 81 151 Z" fill={spec.hair} opacity="0.92" />
        ) : null}

        {spec.glasses ? (
          <>
            <rect x="78" y="117" width="39" height="24" rx="8" fill="none" stroke="#2b2f35" strokeWidth="3" />
            <rect x="123" y="117" width="39" height="24" rx="8" fill="none" stroke="#2b2f35" strokeWidth="3" />
            <path d="M117 126 L123 126" stroke="#2b2f35" strokeWidth="3" />
          </>
        ) : null}

        {spec.eyepatch ? (
          <>
            <ellipse cx="98" cy="127" rx="17" ry="13" fill="#16191f" />
            <path d="M80 119 L65 106 M116 119 L151 97" stroke="#16191f" strokeWidth="5" />
          </>
        ) : null}

        <path d="M31 267 L209 267" stroke="#d6b26d" strokeWidth="2" opacity="0.7" />
        <circle cx="120" cy="267" r="4" fill="#d6b26d" />
      </svg>
      <span className="portrait-art-label">Editorial illustration</span>
    </div>
  );
}

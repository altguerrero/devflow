import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEVICON_FALLBACK_CLASS = "devicon-code-plain";

const TECH_ICON_MAP: Record<string, string> = {
  javascript: "devicon-javascript-plain",
  js: "devicon-javascript-plain",
  typescript: "devicon-typescript-plain",
  ts: "devicon-typescript-plain",
  python: "devicon-python-plain",
  java: "devicon-java-plain",
  kotlin: "devicon-kotlin-plain",
  scala: "devicon-scala-plain",
  go: "devicon-go-original-wordmark",
  golang: "devicon-go-original-wordmark",
  rust: "devicon-rust-plain",
  ruby: "devicon-ruby-plain",
  php: "devicon-php-plain",
  c: "devicon-c-plain",
  "c++": "devicon-cplusplus-plain",
  cplusplus: "devicon-cplusplus-plain",
  "c#": "devicon-csharp-plain",
  csharp: "devicon-csharp-plain",
  swift: "devicon-swift-plain",
  dart: "devicon-dart-plain",
  react: "devicon-react-original",
  "react.js": "devicon-react-original",
  nextjs: "devicon-nextjs-plain",
  "next.js": "devicon-nextjs-plain",
  node: "devicon-nodejs-plain",
  nodejs: "devicon-nodejs-plain",
  "node.js": "devicon-nodejs-plain",
  express: "devicon-express-original",
  nestjs: "devicon-nestjs-plain",
  angular: "devicon-angularjs-plain",
  vue: "devicon-vuejs-plain",
  vuejs: "devicon-vuejs-plain",
  svelte: "devicon-svelte-plain",
  html: "devicon-html5-plain",
  html5: "devicon-html5-plain",
  css: "devicon-css3-plain",
  css3: "devicon-css3-plain",
  sass: "devicon-sass-original",
  tailwind: "devicon-tailwindcss-plain",
  tailwindcss: "devicon-tailwindcss-plain",
  bootstrap: "devicon-bootstrap-plain",
  graphql: "devicon-graphql-plain",
  mysql: "devicon-mysql-plain",
  postgres: "devicon-postgresql-plain",
  postgresql: "devicon-postgresql-plain",
  mongodb: "devicon-mongodb-plain",
  redis: "devicon-redis-plain",
  docker: "devicon-docker-plain",
  kubernetes: "devicon-kubernetes-plain",
  aws: "devicon-amazonwebservices-original-wordmark",
  azure: "devicon-azure-plain",
  gcp: "devicon-googlecloud-plain",
  firebase: "devicon-firebase-plain",
  git: "devicon-git-plain",
  github: "devicon-github-original",
  gitlab: "devicon-gitlab-plain",
};

const normalizeTechName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\.js/g, "js")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s/g, "-");

export const getDeviconClass = (name: string) => {
  if (!name?.trim()) return DEVICON_FALLBACK_CLASS;

  const normalized = normalizeTechName(name);
  const iconClass = TECH_ICON_MAP[normalized];

  return iconClass ? `${iconClass} colored` : DEVICON_FALLBACK_CLASS;
};

export const getTimeStamp = (date: Date | string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31104000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;

  return `${Math.floor(diffInSeconds / 31104000)} years ago`;
};

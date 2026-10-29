import type { SimpleIcon } from 'simple-icons'
import { siPython, siJavascript, siHtml5, siCss3, siReact, siVuedotjs, siNextdotjs, siVite, siTailwindcss, siNodedotjs, siExpress, siFastapi, siMongodb, siMongoose, siTableau, siGit, siGithub, siDocker, siKubernetes } from 'simple-icons'

/** Official brand marks from the Simple Icons package. Technologies without one fall back to a typographic mark. */
export const ICONS: Record<string, SimpleIcon> = {
  python: siPython, javascript: siJavascript, html5: siHtml5, css3: siCss3, react: siReact, vue: siVuedotjs, next: siNextdotjs,
  vite: siVite, tailwind: siTailwindcss, node: siNodedotjs, express: siExpress, fastapi: siFastapi, mongodb: siMongodb,
  mongoose: siMongoose, tableau: siTableau, git: siGit, github: siGithub, docker: siDocker, kubernetes: siKubernetes,
}

import edge from "edge.js"
import env from "./env.js"

edge.global('appUrl', env.get('HOST'))
import "./style.css";
import { GameApplication } from "./app/GameApplication";

const host = document.querySelector<HTMLDivElement>("#app");

if (!host) {
  throw new Error("Missing #app host element");
}

const app = new GameApplication(host);
app.start();

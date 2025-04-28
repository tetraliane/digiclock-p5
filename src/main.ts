import p5 from "p5";
import { sketch } from "./sketch";
import "./styles.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const parent = document.getElementById("app")!;
new p5(sketch, parent);

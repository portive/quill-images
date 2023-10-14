import { render } from "preact";

console.log("Preact Test");

function App() {
  return <div>Hello, Preact in Vite!</div>;
}

render(<App />, document.getElementById("preact-root")!);

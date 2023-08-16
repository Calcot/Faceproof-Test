import "./App.css";
import { FaceProofAuthentication } from "./components/authentication";
import { theme } from "antd";

function App() {
  const { token } = theme.useToken();
  return (
    <div
      style={{ backgroundColor: token.colorBgLayout, color: token.colorText }}
      className={"w-full h-screen flex justify-center overflow-hidden"}
    >
      <FaceProofAuthentication />
    </div>
  );
}

export default App;

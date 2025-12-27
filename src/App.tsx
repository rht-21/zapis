import MobileBlockedScreen from "./components/MobileBlockedScreen";
import Notepad from "./components/Notepad";
import ToDo from "./components/ToDo";

const App = () => {
  const isMobileDevice = () =>
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobileDevice()) {
    return <MobileBlockedScreen />;
  }

  return (
    <div className="flex items-center justify-between h-[calc(100dvh-112px)] w-full font-sans">
      <Notepad />
      <ToDo />
    </div>
  );
};

export default App;

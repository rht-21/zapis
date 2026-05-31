import GradientBackdrop from "./components/GradientBackdrop";
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
    <>
      <GradientBackdrop />
      <div className="flex items-stretch justify-between gap-4 h-[calc(100dvh-112px+64px)] w-full font-sans px-4 py-4">
        <Notepad />
        <ToDo />
      </div>
    </>
  );
};

export default App;

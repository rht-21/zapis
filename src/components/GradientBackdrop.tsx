const GradientBackdrop = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background"
    >
      <div className="absolute top-[-10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-primary/40 blur-3xl mix-blend-multiply animate-blob-1" />
      <div className="absolute bottom-[-10%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-secondary/40 blur-3xl mix-blend-multiply animate-blob-2" />
      <div className="absolute top-1/2 left-1/2 w-[50vw] h-[50vw] rounded-full bg-accent/30 blur-3xl mix-blend-multiply animate-blob-3" />
    </div>
  );
};

export default GradientBackdrop;

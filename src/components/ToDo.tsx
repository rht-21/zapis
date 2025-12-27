const ToDo = () => {
  return (
    <section className="w-1/3 h-full overflow-auto border-primary/30 relative">
      <span className="absolute top-0 right-0 bg-primary text-secondary-foreground rounded-bl-xl w-14 pl-1 py-1 uppercase font-medium tracking-wide text-sm flex items-center justify-center">
        ToDo
      </span>
      <div className="flex items-center justify-center h-full w-full text-muted">
        Coming Soon...
      </div>
    </section>
  );
};

export default ToDo;

const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-8 lg:px-12 py-4 glass-bar border-b border-white/20 dark:border-white/10">
      <img
        src="/logo.png"
        alt="Zapis Logo"
        height={36}
        width={36}
        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
      />
    </header>
  );
};

export default Navbar;

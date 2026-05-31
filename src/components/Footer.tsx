const Footer = () => {
  return (
    <footer className="relative z-20 w-full h-12 glass-bar border-t border-white/20 dark:border-white/10 flex items-center justify-center px-4 md:px-8 lg:px-12">
      <p className="text-foreground">
        Made with fun by{" "}
        <a
          href="https://rht21.site/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:underline"
        >
          RHT21
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto bg-card border-t border-border/10">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-container mx-auto px-margin-desktop">
        <div className="font-heading text-headline-md font-bold text-primary mb-4 md:mb-0">KeepsDSA</div>
        <p className="font-sans text-body-md text-muted-foreground mb-4 md:mb-0">© 2026 KeepsDSA Platform.</p>
        <div className="flex gap-4">
          <a className="font-subheading text-[12px] uppercase tracking-wider text-label-sm text-muted-foreground hover:text-primary transition-colors duration-200" href="#">Privacy</a>
          <a className="font-subheading text-[12px] uppercase tracking-wider text-label-sm text-muted-foreground hover:text-primary transition-colors duration-200" href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}

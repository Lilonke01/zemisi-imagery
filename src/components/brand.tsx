export function Brand({ name = 'Zemisi Imagery', subtitle = 'PHOTOGRAPHY & VISUAL STORIES' }: { name?: string; subtitle?: string }) {
  return <span className="brand"><span className="brand-logo"><img src="/zemisi-logo.jpeg" alt="Zemisi Imagery logo" width={1920} height={1080}/></span><span className="wordmark">{name}{subtitle && <span>{subtitle}</span>}</span></span>;
}

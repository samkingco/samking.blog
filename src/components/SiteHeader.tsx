import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-links">
        <p className="site-logo">
          <Link href="/">
            <a>words</a>
          </Link>
        </p>
        <a href="https://samking.co">samking.co</a>
      </div>
      <p className="subtle">
        Documenting some thoughts to help get me back into writing. Posts will
        be about anything. Mostly my journey with design, Web3, and therapy.
      </p>
    </header>
  );
}

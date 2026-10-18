import { workedWith } from "@site/profile";

function initials(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function LogoItem({ name, logo }: { name: string; logo?: string }) {
  return (
    <li className="logo-item">
      {logo ? (
        <img className="logo-mark" src={logo} alt="" width={24} height={24} loading="lazy" />
      ) : (
        <span className="logo-mark logo-initials" aria-hidden="true">
          {initials(name)}
        </span>
      )}
      <span>{name}</span>
    </li>
  );
}

/** A slow, looping strip of companies and products. The second copy only exists to make the loop seamless. */
export function LogoStrip() {
  return (
    <section className="home-section" aria-labelledby="worked-with-heading">
      <h2 className="heading-section" id="worked-with-heading">
        Worked With
      </h2>
      <div className="logo-strip">
        <div className="logo-track">
          <ul className="logo-set">
            {workedWith.map((item) => (
              <LogoItem key={item.name} {...item} />
            ))}
          </ul>
          <ul className="logo-set" aria-hidden="true">
            {workedWith.map((item) => (
              <LogoItem key={item.name} {...item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

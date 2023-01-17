import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import React from "react";

const Badges = () => {
  return (
    <div style={{ marginBottom: 16 }}>
      <a href={"https://www.npmjs.com/package/react-xarrows"}>
        <img src={"https://img.shields.io/npm/v/react-xarrows"} />
      </a>
      <a href={"https://www.npmjs.com/package/react-xarrows"}>
        <img src={"https://img.shields.io/npm/dw/react-xarrows"} />
      </a>
      <a href={"https://bundlephobia.com/package/react-xarrows"}>
        <img src={"https://img.shields.io/bundlephobia/minzip/react-xarrows"} />
      </a>
      <a href={"https://github.com/Eliav2/react-xarrows/issues"}>
        <img src={"https://img.shields.io/github/issues/Eliav2/react-xarrows"} />
      </a>
    </div>
  );
};

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src={"img/logo256.png"} height={128} alt={"xarrows img"} style={{ paddingRight: 16 }} />
          <h1 className="hero__title">{siteConfig.title}</h1>
        </div>
        <p className="hero__subtitle">{siteConfig.tagline}</p>

        <Badges />

        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/quick-start">
            Quick Start️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig, ...rest } = useDocusaurusContext();
  return (
    <Layout title={"Home"}>
      <HomepageHeader />
      <main>
        <Demo />
      </main>
    </Layout>
  );
}

const BoxStyle = {
  border: "solid",
  borderRadius: 12,
  padding: 8,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
} as const;

function Demo() {
  return <section style={{ textAlign: "center" }}>here the demo will be</section>;
}

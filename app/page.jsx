import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Research from "@/components/Research";
import Skills from "@/components/Skills";
import GitHubActivity from "@/components/GitHubActivity";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HeartbeatDivider from "@/components/HeartbeatDivider";

export default function Page() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <HeartbeatDivider label="PROFILE" />
        <About />
        <HeartbeatDivider label="BUILD LOG" />
        <Projects />
        <HeartbeatDivider label="RESEARCH FEED" />
        <Research />
        <HeartbeatDivider label="CAPABILITIES" />
        <Skills />
        <HeartbeatDivider label="ACTIVITY" />
        <GitHubActivity />
        <HeartbeatDivider label="CONNECT" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

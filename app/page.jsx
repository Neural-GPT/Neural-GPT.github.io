import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Research from "@/components/Research";
import Skills from "@/components/Skills";
import GitHubActivity from "@/components/GitHubActivity";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HeartbeatDivider from "@/components/ui/HeartbeatDivider";

export default function Page() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <HeartbeatDivider seed={1} bpm={72} className="-my-6" />
        <About />
        <HeartbeatDivider seed={2} bpm={68} className="-my-6" />
        <Projects />
        <HeartbeatDivider seed={3} bpm={76} className="-my-6" />
        <Research />
        <HeartbeatDivider seed={4} bpm={70} className="-my-6" />
        <Skills />
        <HeartbeatDivider seed={5} bpm={74} className="-my-6" />
        <GitHubActivity />
        <HeartbeatDivider seed={6} bpm={66} className="-my-6" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

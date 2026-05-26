export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 pt-32">
      <h1 className="text-4xl font-bold mb-8 text-foreground">About KeepsDSA</h1>

      <p className="text-lg text-muted-foreground mb-6">
        KeepsDSA is a personal DSA knowledge management platform designed for
        students, developers, and interview aspirants to organize coding
        solutions, handwritten notes, revision schedules, and problem-solving
        progress in one place.
      </p>

      <p className="text-muted-foreground mb-6">
        Built to bridge the gap between solving problems on coding platforms and
        retaining long-term understanding, KeepsDSA helps users create their own
        structured learning vault.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground">What You Can Do</h2>

      <ul className="space-y-3 text-muted-foreground">
        <li>• Save and organize DSA problems</li>
        <li>• Store multiple solutions for the same problem</li>
        <li>• Upload handwritten notes and PDFs</li>
        <li>• Track revision progress</li>
        <li>• Manage coding patterns and concepts</li>
        <li>• Build your personal coding knowledge base</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground">Our Mission</h2>

      <p className="text-muted-foreground">
        Our mission is to help learners transform scattered coding practice into
        structured long-term mastery.
      </p>

      <section className="mt-16 border-t border-border/20 pt-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">About the Creator</h2>

        <p className="text-foreground/80 mb-6">
          Hi, I&apos;m Rohanish — a student and developer passionate about building
          practical tools that make learning more structured, efficient, and
          meaningful.
        </p>

        <p className="text-muted-foreground mb-6">
          KeepsDSA was created from my own experience preparing for Data Structures
          and Algorithms. While solving coding problems, I realized that simply
          completing questions wasn&apos;t enough — retaining patterns, revising solutions,
          and organizing notes effectively was the real challenge.
        </p>

        <p className="text-muted-foreground mb-6">
          I built KeepsDSA to solve that problem: a platform where developers can
          save coding solutions, upload handwritten notes, organize concepts, and
          build a personal knowledge vault for long-term mastery.
        </p>

        <p className="text-muted-foreground mb-6">
          This project reflects my interest in full-stack development, problem
          solving, and building tools that combine technology with real educational
          value.
        </p>

        <p className="text-foreground/80 font-medium">
          My goal is simple: build products that help learners learn smarter.
        </p>
      </section>
    </div>
  )
}

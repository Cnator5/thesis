"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";

const trustedPartners = [
  "Ministry of Higher Education",
  "University of Yaoundé I",
  "Université de Douala",
  "Catholic University Institute of Buea",
  "Cameroon Digital Week",
  "African Development Bank",
  "Goethe-Institut Kamerun",
  "British Council Cameroon",
  "Institut Français du Cameroun",
  "Cameroon Reading Association",
];

const serviceHighlights = [
  {
    title: "Topic Development",
    description:
      "Clarify research gaps, refine your problem statement, and craft a defendable thesis or project topic aligned with your faculty requirements.",
  },
  {
    title: "Proposal & Chapter Writing",
    description:
      "From background and literature review to methodology and discussion, we draft academically rigorous chapters tailored to your discipline.",
  },
  {
    title: "Data Analysis Services",
    description:
      "We design instruments, clean datasets, and run advanced statistical or qualitative analysis using SPSS, STATA, R, NVivo, and Atlas.ti.",
  },
  {
    title: "Copy Editing & Proofreading",
    description:
      "Ensure every chapter meets citation styles (APA, MLA, Chicago, Harvard) and passes plagiarism and grammar checks before submission.",
  },
  {
    title: "Presentation & Defense Coaching",
    description:
      "Build confident slides, anticipate viva voce questions, and rehearse delivery with experienced supervisors and examiners.",
  },
  {
    title: "Business & Capstone Projects",
    description:
      "MBA, engineering, and applied research teams trust us for feasibility studies, implementation roadmaps, and impact measurement.",
  },
];

const stats = [
  { label: "Supervisor-ready drafts", value: "95%", sub: "approved on first review" },
  { label: "Disciplines covered", value: "100+", sub: "STEM, Business, Social Sciences" },
  { label: "Projects delivered", value: "1,200+", sub: "since 2012" },
];

const processSteps = [
  {
    title: "Research Blueprint",
    detail:
      "Develop research questions, objectives, hypotheses, and conceptual frameworks aligned with your course.",
  },
  {
    title: "Proposal & Literature Review",
    detail:
      "Craft compelling rationales, synthesize sources, and manage citations via EndNote, Mendeley, or Zotero.",
  },
  {
    title: "Methodology & Data Collection",
    detail:
      "Design quantitative, qualitative, or mixed methods with validated instruments and ethical compliance.",
  },
  {
    title: "Analysis & Interpretation",
    detail:
      "Produce tables, charts, thematic maps, and statistical summaries ready for defense slides.",
  },
  {
    title: "Editing & Submission",
    detail:
      "Polish language, tighten arguments, and format references for Turnitin-ready manuscripts.",
  },
];

const whatsappPrimary = "237651624573";
const whatsappSupport = "237681326315";

export default function HomePage() {
  return (
    <div className="relative bg-white text-slate-900">
      <Head>
        <title>
          Thesis & Dissertation Writing Services in Cameroon | Excellent Research
        </title>
        <meta
          name="description"
          content="Excellent Research delivers thesis, dissertation, and academic project writing services in Cameroon. Get expert topic development, proposal writing, data analysis, and defense coaching."
        />
        <meta
          name="keywords"
          content="thesis writing Cameroon, dissertation help, academic research support, data analysis services, project writing, university research assistance"
        />
        <link rel="canonical" href="https://www.yourdomain.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Excellent Research",
              url: "https://www.yourdomain.com/",
              description:
                "Excellent Research offers thesis, dissertation, and academic project writing services including topic development, proposal drafting, and data analysis.",
              areaServed: "Cameroon",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                telephone: "+237 651 23 45 67",
                availableLanguage: ["English", "French"],
              },
              sameAs: [
                "https://www.facebook.com/yourpage",
                "https://www.linkedin.com/company/yourcompany",
              ],
              serviceType: [
                "Thesis writing",
                "Dissertation support",
                "Academic editing",
                "Data analysis",
              ],
            }),
          }}
        />
      </Head>

      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 right-10 h-72 w-72 rounded-full bg-indigo-200 blur-[120px]" />
        <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-emerald-200 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-sky-200 blur-[100px]" />
      </div>

      <main className="flex flex-col gap-24 pb-32">
        {/* Hero */}
        <section className="pt-12 md:pt-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 text-center md:flex-row md:text-left">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-[0_0_20px_rgba(15,23,42,0.08)]">
                Thesis &amp; Dissertation Experts
              </span>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Cameroon’s trusted partner for thesis, dissertation, and academic project writing.
              </h1>
              <p className="mt-6 text-base text-slate-600 sm:text-lg">
                We guide undergraduate, postgraduate, and doctoral researchers through every stage of academic
                writing—from topic validation and proposal drafting to data analysis and final defense preparation.
                With Excellent Research, every chapter meets faculty expectations and international academic standards.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <Button>
                  <Link href="/contact" className="font-semibold">
                    Book a thesis strategy call
                  </Link>
                </Button>
                <a
                  href={`https://wa.me/${whatsappPrimary}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
                  aria-label="Chat with Excellent Research on WhatsApp"
                >
                  <span>Chat on WhatsApp</span>
                  <span aria-hidden>💬</span>
                </a>
                <Link
                  href="#process"
                  className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
                >
                  Discover our writing process →
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="animate-float-slow overflow-hidden rounded-2xl border border-white/50 bg-white/70 shadow-2xl backdrop-blur-xl">
                <Image
                  src="/images/award2.png"
                  alt="Researchers collaborating on a thesis manuscript in the Excellent Research studio"
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Stat pills */}
          <div className="mx-auto mt-16 flex w-full max-w-4xl flex-wrap items-center justify-center gap-6 px-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="flex min-w-[210px] flex-col rounded-2xl border border-slate-200 bg-white/80 p-5 text-center shadow-lg backdrop-blur"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                <span className="text-sm font-semibold text-slate-500">{stat.label}</span>
                <span className="text-xs text-slate-400">{stat.sub}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <section id="services">
          <div className="mx-auto w-full max-w-6xl px-4">
            <motion.h2
              className="text-center text-3xl font-semibold sm:text-4xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Comprehensive academic writing services that cover every chapter.
            </motion.h2>
            <motion.p
              className="mx-auto mt-6 max-w-3xl text-center text-base text-slate-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Our multidisciplinary team of supervisors, methodologists, data analysts, and editors provide end-to-end
              support for theses, dissertations, capstone projects, feasibility studies, and action research across STEM,
              social sciences, business, education, and health sciences.
            </motion.p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {serviceHighlights.map((service, idx) => (
                <motion.div
                  key={service.title}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                >
                  <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                  <p className="text-sm text-slate-600">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process timeline */}
        <section id="process">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 md:flex-row md:items-start md:gap-16">
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-semibold sm:text-4xl">
                A structured thesis-writing process with transparent milestones.
              </h2>
              <p className="mt-6 text-base text-slate-600">
                We map out deliverables chapter by chapter, ensuring your supervisor’s feedback is integrated on time and
                that institutional formatting guidelines are respected.
              </p>
              <Button className="mt-6">
                <Link href="/services" className="font-semibold">
                  View detailed service packages
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="relative w-full md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute left-5 top-4 bottom-4 w-[2px] bg-gradient-to-b from-indigo-300 to-emerald-400 md:left-6" />
              <div className="space-y-8 pl-12">
                {processSteps.map((step, idx) => (
                  <motion.div
                    key={step.title}
                    className="relative rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-xl backdrop-blur"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                  >
                    <span className="absolute -left-10 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-lg md:-left-12">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Collaboration */}
        <section>
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 lg:flex-row-reverse lg:items-center lg:gap-16">
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/images/show_off.jpg"
                  alt="Student collaborating with academic writing coach over a digital workspace"
                  width={1280}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              className="w-full space-y-6 lg:w-1/2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold sm:text-4xl">Collaborative, supervisor-ready drafts every week.</h2>
              <p className="text-base text-slate-600">
                Track revisions, comment on chapters, and upload supervisor feedback in a secure portal. Our editors respond
                within 24 hours, ensuring you never miss institutional deadlines.
              </p>
              <p className="text-base text-slate-600">
                Whether you’re studying in Yaoundé, Douala, Buea, or abroad, you receive live progress dashboards, version
                history, and bilingual support (English & French) to maintain academic integrity.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  95% supervisor approval on first submission
                </span>
                <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                  100+ disciplines covered
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Data Analysis */}
        <section>
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 lg:flex-row lg:gap-16">
            <motion.div
              className="w-full space-y-6 lg:w-1/2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Data analysis and visualization that strengthens your findings.
              </h2>
              <p className="text-base text-slate-600">
                Our statisticians and qualitative researchers translate raw data into defendable insights. We handle
                sampling, instrument reliability, coding, and advanced modelling while ensuring your interpretation aligns
                with research objectives.
              </p>
              <ul className="space-y-3 text-base text-slate-600">
                <li>✔ Descriptive and inferential statistics, regression, ANOVA, SEM</li>
                <li>✔ Qualitative coding, thematic analysis, discourse analysis</li>
                <li>✔ Power calculations, pilot studies, and validation reports</li>
                <li>✔ Publication-ready tables, charts, and appendices</li>
              </ul>
            </motion.div>
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/images/thesis.jpg"
                    alt="Data analyst interpreting thesis research results on a laptop with charts"
                    width={1280}
                    height={830}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Excellent Research Pro */}
        <section>
          <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 px-4 lg:flex-row lg:gap-16">
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/images/thesis_books.jpg"
                    alt="Academic board reviewing standardized thesis rubrics with analytics"
                    width={1280}
                    height={720}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              className="w-full space-y-6 lg:w-1/2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Excellent Research Pro for departments and research boards.
              </h2>
              <p className="text-base text-slate-600">
                Standardise evaluation criteria, manage multiple cohorts, and monitor progress across faculties. Configure
                reviewer workflows, plagiarism checks, and anonymised grading within a secure academic environment.
              </p>
              <p className="text-base text-slate-600">
                Generate analytics on completion rates, publication outputs, and funding allocations to improve research
                quality year after year.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trusted Partners */}
        <section>
          <div className="mx-auto w-full max-w-6xl px-4">
            <motion.h2
              className="text-center text-3xl font-semibold sm:text-4xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Trusted by universities, research institutes, and scholarship boards.
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              For over a decade, Excellent Research has supported Cameroonian and international scholars in producing
              impactful academic work that meets funding and accreditation standards.
            </motion.p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm font-semibold text-slate-500">
              {trustedPartners.map((partner, idx) => (
                <motion.span
                  key={partner}
                  className="rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 backdrop-blur transition hover:border-indigo-200 hover:text-indigo-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.03 }}
                >
                  {partner}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp badge */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end space-y-3 sm:bottom-6 sm:right-6 sm:space-y-4">
        <a
          href={`https://wa.me/${whatsappSupport}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-pulse inline-flex items-center gap-3 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition-transform hover:scale-105 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
          aria-label="Contact Excellent Research support on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.47-.148-.669.15-.198.297-.767.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.61-.916-2.206-.242-.58-.487-.5-.669-.51-.173-.006-.372-.007-.571-.007s-.521.075-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.1 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.123-.272-.198-.57-.347zm-5.421 7.617c-1.191 0-2.381-.195-3.509-.577l-3.909 1.024 1.04-3.814c-.673-1.045-1.205-2.181-1.498-3.377C1.212 14.271 0 12.211 0 9.999 0 4.477 5.373 0 12 0c3.185 0 6.187 1.24 8.438 3.488C22.687 5.737 24 8.741 24 12c0 6.627-5.373 12-12 12zm0-22C6.486 2 2 6.486 2 12c0 2.083 1.04 4.166 2.888 5.833l-.96 3.521 3.624-.948C9.834 21.001 10.912 21.2 12 21.2c5.514 0 10-4.486 10-10S17.514 2 12 2z" />
          </svg>
          {/* <span>24/7 Support</span> */}
        </a>
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          70% {
            transform: scale(1.4);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
        .whatsapp-pulse::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 2px solid rgba(16, 185, 129, 0.5);
          animation: pulse-ring 1.8s infinite;
        }
      `}</style>
    </div>
  );
}
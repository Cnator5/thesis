'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const services = [
  {
    id: 'topic-development',
    title: 'Topic Development',
    image: '/images/topic-development.jpg',
    alt: 'Topic development illustration',
    width: 640,
    height: 360,
    description:
      'We guide students in crafting thesis, dissertation, and research topics that attract readers. With our extensive cross-disciplinary experience, we maintain a rich repository of ideas across Law, Public Administration, Linguistics, Public Law, Economics, Finance, Accounting, International Relations, Sociology, Marketing, Education, and more.',
  },
  {
    id: 'proposal-development',
    title: 'Development Service',
    image: '/images/Thesis-Writing.jpg',
    alt: 'Proposal development mind map',
    width: 640,
    height: 360,
    description:
      'Before your final project begins, a persuasive proposal must win committee approval. Our consultants collaborate with you to frame an evidence-backed proposal that demonstrates feasibility and ensures you are cleared to proceed.',
  },
  {
    id: 'academic-writing',
    title: 'Academic Writing Services',
    image: '/images/Thesis-Format.jpg',
    alt: 'Academic writing process diagram',
    width: 640,
    height: 360,
    description:
      'From research design to oral presentation preparation, we deliver thesis and project manuscripts that captivate. Universities and training institutions rely on us for dissertations, essays, course work, curricula, research papers, and other scholarly deliverables.',
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis Services',
    image: '/images/Thesis-Proposal.jpg',
    alt: 'Data analytics dashboard',
    width: 640,
    height: 360,
    description:
      'Our analysts translate raw datasets into actionable insight using statistical and mathematical techniques. We work fluently with RStudio, SAS, STATA, MATLAB, SPSS, and AMOS to provide descriptive and inferential analytics tailored to your project.',
  },
  {
    id: 'business-plans',
    title: 'Business Plans Help',
    image: '/images/business-plan.jpg',
    alt: 'Business plan infographic',
    width: 640,
    height: 360,
    description:
      'We craft academic and professional business plans rooted in rigorous market research. Finance, strategy, operations, marketing, and implementation roadmaps are delivered by seasoned consultants.',
  },
  {
    id: 'copy-editing',
    title: 'Copy Editing & Proofreading Services',
    image: '/images/Thesis-introduction.jpg',
    alt: 'Copy editing venn diagram',
    width: 640,
    height: 360,
    description:
      'Precision editing eliminates errors and elevates clarity. We deliver developmental, line, copy editing, and proofreading to ensure your message lands with impact and authority across every audience.',
  },
  {
    id: 'blog-writing',
    title: 'Blog Writing Services',
    image: '/images/blog-writing.jpg',
    alt: 'Blog content planning on tablet',
    width: 640,
    height: 360,
    description:
      'Consistent, authoritative blog content nurtures trust and boosts search visibility. Let our team ideate, draft, and optimize the posts that keep your brand top-of-mind.',
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter Writing Service',
    image: '/images/cover-letter.jpg',
    alt: 'Cover letter template',
    width: 640,
    height: 360,
    description:
      'A compelling cover letter distinguishes your application. We design tailored narratives that align your achievements with each opportunity and persuade hiring managers to read your resume.',
  },
  {
    id: 'resume-writing',
    title: 'Resume Writing Service',
    image: '/images/resume-writing.jpg',
    alt: 'Professional resume layout',
    width: 640,
    height: 360,
    description:
      'Your resume is a strategic asset. We produce executive-level documents that highlight measurable impact, communicate brand value, and pass modern Applicant Tracking Systems with ease.',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export default function OurServicesPage() {
  return (
    <main className="bg-neutral-50 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center md:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl"
          >
            Premium Academic & Professional Writing Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="mt-6 max-w-3xl text-lg text-slate-600 md:text-xl"
          >
            From topic ideation through publication-ready manuscripts, we deliver
            meticulous research support, persuasive writing, and reliable data
            analytics that help you excel at every academic and professional milestone.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-20">
        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.article
              key={service.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className={`flex flex-col gap-10 rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100/70 transition hover:-translate-y-1 hover:shadow-xl hover:ring-emerald-100/80 md:p-10 lg:flex-row ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100/60 ring-1 ring-white/40">
                <div className="relative h-56 w-full sm:h-64 lg:h-full lg:w-[360px]">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover"
                    priority={index < 2}
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center space-y-4">
                <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                  {service.title}
                </h2>
                <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                  {service.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-5xl space-y-6 px-6 md:px-8">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-slate-900 md:text-3xl"
          >
            Other Services
          </motion.h3>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4 text-base leading-relaxed text-slate-600 md:text-lg md:leading-8"
          >
            <p>
              We mentor you on why your thesis or project is the pivotal highlight of your degree,
              uncovering reflections that inspire captivating topics.
            </p>
            <p>
              Learn to craft research that astonishes—formulating questions, structuring chapters,
              sourcing evidence, designing surveys, and delivering persuasive presentations.
            </p>
            <p>
              Our writers bring passion, flair, and linguistic excellence to every manuscript so
              your voice resonates with authority.
            </p>
            <p>
              Whether you&apos;re pursuing a bachelor&apos;s, master&apos;s, or doctorate, we guide you
              to think beyond conventions and produce research that showcases critical insight,
              creativity, and innovation.
            </p>
            <p>
              Expect writing that does more than fill pages: it confronts contemporary challenges,
              sparks dialogue, and leaves a lasting impression on every reader.
            </p>
            <p>
              There is no stigma in seeking support with thesis development, data analysis, research
              projects, or term papers. Privately, most scholars rely on expert collaborators to
              stay ahead.
            </p>
            <p>
              Our team spans social sciences, law, chemistry, philosophy, finance, communications,
              public administration, international relations, political science, journalism, and
              more. Each consultant is devoted to delivering outstanding academic support—and we
              love what we do.
            </p>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
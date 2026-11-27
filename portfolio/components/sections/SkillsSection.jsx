'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/SkillsSection.module.css'
import {
  SiDotnet, SiPython, SiOpenjdk, SiMysql, SiJavascript, SiHtml5, SiCss, SiAngular, SiFastapi,
  SiDocker, SiJenkins, SiGit, SiGithub, SiPostman, SiSwagger, SiLangchain, SiHuggingface,
  SiScikitlearn, SiNumpy, SiPandas, SiJsonwebtokens, SiUipath, SiPostgresql,
} from 'react-icons/si'
import { FaAws, FaDatabase, FaBrain, FaRobot, FaVial, FaMicrosoft, FaChartBar, FaServer, FaCubes, FaDownload } from 'react-icons/fa'
import { TbBrandCSharp, TbSql } from 'react-icons/tb'

const ICONS = {
  'C#': TbBrandCSharp, Python: SiPython, Java: SiOpenjdk, SQL: TbSql, JavaScript: SiJavascript,
  'HTML / CSS': SiHtml5, CSS: SiCss, 'ASP.NET Core': SiDotnet, 'Web API': SiDotnet, 'Entity Framework Core': SiDotnet,
  FastAPI: SiFastapi, 'REST APIs': FaServer, 'JWT Auth': SiJsonwebtokens, Angular: SiAngular,
  'SQL Server': FaMicrosoft, MySQL: SiMysql, PostgreSQL: SiPostgresql, 'Schema design': FaDatabase,
  'EF Core migrations': FaDatabase, Tableau: FaChartBar, 'Power BI': FaChartBar,
  Docker: SiDocker, Jenkins: SiJenkins, 'CI/CD': SiJenkins, 'AWS EC2 / S3': FaAws, Git: SiGit, GitHub: SiGithub,
  MSTest: FaVial, NUnit: FaVial, Postman: SiPostman, Swagger: SiSwagger,
  'Machine learning': FaBrain, CNNs: FaBrain, NLP: FaBrain, RAG: FaRobot, LangChain: SiLangchain,
  'Hugging Face': SiHuggingface, 'scikit-learn': SiScikitlearn, NumPy: SiNumpy, Pandas: SiPandas,
  'Prompt engineering': FaRobot, 'UiPath RPA': SiUipath, 'SOLID / OOP': FaCubes,
}

export default function SkillsSection() {
  const ref = useRef(null)
  const { groups, resume } = profile.skillGroups

  useEffect(() => {
    const section = ref.current
    const scroller = document.querySelector('main')
    if (!section || !scroller) return
    const els = section.querySelectorAll('[data-reveal]')
    gsap.set(els, { opacity: 0, y: 30 })
    let shown = false
    function check() {
      if (shown) return
      if (section.getBoundingClientRect().top < window.innerHeight * 0.6) {
        shown = true
        gsap.to(els, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 })
      }
    }
    check()
    scroller.addEventListener('scroll', check, { passive: true })
    return () => scroller.removeEventListener('scroll', check)
  }, [])

  return (
    <section ref={ref} className={styles.section} aria-label="Skills">
      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow} data-reveal>Toolkit</p>
            <h2 className={styles.title} data-reveal>
              What I <em>build</em> with.
            </h2>
          </div>
          <a className={styles.resumeBtn} href={resume} target="_blank" rel="noopener" data-reveal>
            <FaDownload aria-hidden /> Download résumé
          </a>
        </header>

        <div className={styles.grid} data-scroll-lane>
          {groups.map((g) => (
            <article key={g.title} className={styles.card} data-reveal>
              <div className={styles.cardHead}>
                <span className={styles.num}>{g.num}</span>
                <h3>{g.title}</h3>
              </div>
              <p className={styles.blurb}>{g.blurb}</p>
              <ul className={styles.chips}>
                {g.items.map((s) => {
                  const Icon = ICONS[s]
                  return (
                    <li key={s} className={styles.chip}>
                      {Icon && <Icon aria-hidden className={styles.icon} />}
                      {s}
                    </li>
                  )
                })}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

import GradeCalculator from '@/components/tooliyapa/GradeCalculator'
import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Grade Calculator — Marks, Weighted Grades & Final Needed',
  description: 'Convert marks to percentages, calculate weighted grades, and estimate the grade needed on remaining coursework to reach a target.',
  pathname: '/calculators/grade',
})

export default function Page() {
  return <CalculatorPageShell eyebrow="Education calculator" title="Grade Calculator" intro="Convert marks to percentages, combine weighted coursework, or estimate what you need on the remaining course weight to reach a target.">
    <GradeCalculator />

    <article className="mt-12 max-w-4xl space-y-10 text-slate-700 dark:text-slate-300">
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Marks and percentages</h2>
        <p className="mt-3 leading-7">A marks percentage is points earned divided by points possible, multiplied by 100. For example, 45 points out of 50 is 90%. Scores above 100% can occur when extra credit allows earned points to exceed the nominal maximum.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How weighted grades work</h2>
        <p className="mt-3 leading-7">Weighted grading gives some assignments or categories more influence than others. A score of 80% with a 40% course weight contributes 32 percentage points to the final course result. This calculator adds the weighted contributions and also shows the normalized average across only the items you entered.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Final grade required</h2>
        <p className="mt-3 leading-7">If part of a course is already complete, the required average on the remaining work can be estimated from your current average, the percentage of course weight completed, and your target overall percentage. The calculation assumes your current grade correctly represents all completed work.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Understanding the remaining-weight formula</h2>
        <p className="mt-3 leading-7">First, multiply the current grade by the completed course weight to find the contribution already earned. Subtract that contribution from the target overall grade, then divide by the remaining course weight. The result is the average required on all remaining work.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What if the required result is above 100%?</h2>
        <p className="mt-3 leading-7">A requirement above 100% means the target cannot normally be reached under the entered weights without extra credit, bonus marks, a grading adjustment, or another change to the assumptions. A result at or below 0% means the target has already been mathematically secured.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Grading scales vary</h2>
        <p className="mt-3 leading-7">Tooliyapa reports percentages rather than automatically assigning A, B, C, GPA, or other labels. Schools, universities, instructors, and countries use different cutoffs and grading policies, so apply your institution's official scale to the calculated percentage.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2>
        <div className="mt-4 space-y-5"><div><h3 className="font-semibold text-slate-900 dark:text-white">Do the weighted items need to total 100%?</h3><p className="mt-1 leading-7">No. You can enter a partial set of coursework. The calculator shows both the weight represented and the normalized average across those entered items. The combined weight may not exceed 100%.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Does this calculate GPA?</h3><p className="mt-1 leading-7">No. GPA scales vary significantly, so this page focuses on marks, percentages, weighted grades, and final-grade requirements.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Can a grade exceed 100%?</h3><p className="mt-1 leading-7">Yes, if your course awards extra credit. The calculator allows percentages above 100 rather than silently capping them.</p></div></div>
      </section>
    </article>
  </CalculatorPageShell>
}

import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import LoanCalculator from '@/components/tooliyapa/LoanCalculator'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Loan / EMI Calculator – Monthly Payment & Interest',
  description: 'Estimate monthly loan or EMI payments, total interest, payoff time, and the effect of extra monthly payments for a fixed-rate loan.',
  pathname: '/calculators/loan',
})

const Section = ({ title, children }) => <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/70"><h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2><div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{children}</div></section>

export default function Page() {
  return <CalculatorPageShell eyebrow="Calculators" title="Loan / EMI Calculator" intro="Estimate a fixed-rate monthly loan payment, total interest, payoff time, and how optional extra monthly payments may change the repayment schedule.">
    <LoanCalculator />
    <div className="mt-14 grid gap-5 md:grid-cols-2">
      <Section title="How the loan payment is calculated"><p>The calculator uses the standard fixed-payment amortization formula. The annual interest rate is divided by 12 to obtain a monthly rate, and the payment is calculated over the exact number of months you enter.</p><p>For a 0% loan, the monthly payment is simply the loan amount divided by the number of months.</p></Section>
      <Section title="What EMI means"><p>EMI commonly means equal monthly instalment. In this calculator, the estimated EMI covers principal and interest for a fixed-rate loan. It does not automatically include fees, insurance, taxes, or other lender charges.</p></Section>
      <Section title="What extra monthly payments do"><p>An extra monthly payment is added to the scheduled payment and assumed to reduce principal after that month’s interest is applied. If the lender allows penalty-free prepayment, extra payments can shorten the payoff period and reduce total interest.</p></Section>
      <Section title="Important assumptions"><ul className="list-disc space-y-2 pl-5"><li>The interest rate stays fixed for the full loan term.</li><li>Interest compounds monthly and payments are made at the end of each month.</li><li>The loan term is entered as an exact whole number of months.</li><li>Extra payments, when entered, are made every month.</li></ul></Section>
      <Section title="Why lender figures may differ"><p>Real loan statements can differ because lenders may use different rounding methods, payment dates, day-count rules, compounding conventions, fees, insurance, taxes, or prepayment rules. Use the result as an estimate rather than a lender quote.</p></Section>
      <Section title="Example"><p>For a loan amount of 100,000 at a 6% annual rate over 60 months, the estimated scheduled monthly payment is about 1,933.28. Without extra payments, the estimated total interest is about 15,996.81.</p></Section>
      <Section title="Frequently asked questions"><h3 className="font-semibold text-slate-900 dark:text-white">Can I use this for a 0% loan?</h3><p>Yes. Enter 0 for the annual interest rate.</p><h3 className="font-semibold text-slate-900 dark:text-white">Does it include processing fees?</h3><p>No. Add lender fees separately when comparing the real cost of borrowing.</p><h3 className="font-semibold text-slate-900 dark:text-white">Can I enter years instead of months?</h3><p>Convert years to months first. For example, 5 years is 60 months. Using months avoids hidden rounding of partial years.</p></Section>
      <Section title="Use as an estimate"><p>This calculator is for general informational planning. It is not financial advice and does not replace the repayment schedule or disclosures supplied by a lender.</p></Section>
    </div>
  </CalculatorPageShell>
}

export const CALCULATOR_TOOLS = [
  {
    id: 'percentage',
    title: 'Percentage Calculator',
    description: 'Calculate percentages, percentage change, and increases or decreases.',
    href: '/calculators/percentage',
    category: 'Calculators',
    keywords: 'percentage percent percentage calculator percent change percentage increase percentage decrease',
    available: true,
  },
  {
    id: 'loan',
    title: 'Loan / EMI Calculator',
    description: 'Estimate monthly payments, total interest, payoff time, and the effect of extra payments.',
    href: '/calculators/loan',
    category: 'Calculators',
    keywords: 'loan emi monthly payment repayment interest amortization extra payment finance calculator',
    available: true,
  },
]

export const AVAILABLE_CALCULATORS = CALCULATOR_TOOLS.filter(({ available }) => available)

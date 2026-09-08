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
]

export const AVAILABLE_CALCULATORS = CALCULATOR_TOOLS.filter(({ available }) => available)


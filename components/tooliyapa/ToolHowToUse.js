export default function ToolHowToUse({ steps = [], title = 'How to use' }) {
  if (!steps?.length) return null

  return (
    <section className="mt-10" aria-labelledby="howto-heading">
      <h2 id="howto-heading" className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">
        {title}
      </h2>
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

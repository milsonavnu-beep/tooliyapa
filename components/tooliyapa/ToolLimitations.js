export default function ToolLimitations({ limitations = [], title = 'Good to know' }) {
  if (!limitations?.length) return null

  return (
    <section className="mt-10" aria-labelledby="limits-heading">
      <h2 id="limits-heading" className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3">
        {title}
      </h2>
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {limitations.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

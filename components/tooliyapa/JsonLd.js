/**
 * Serialize JSON-LD without injecting unescaped script breakers.
 */
export default function JsonLd({ data }) {
  if (!data) return null
  const list = Array.isArray(data) ? data : [data]
  return (
    <>
      {list.filter(Boolean).map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  )
}

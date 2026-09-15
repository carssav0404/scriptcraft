export function PageBackground({
  variant = 'faded',
  image,
}: {
  variant?: 'solid' | 'faded'
  image: string
}) {
  return (
    <>
      <img
        src={image}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover ${
          variant === 'faded' ? 'opacity-40' : ''
        }`}
      />
      {variant === 'solid' ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#332920]/70 via-[#332920]/40 to-[#332920]/80" />
      ) : (
        <div className="absolute inset-0 bg-[#FBF4EC]/20" />
      )}
    </>
  )
}
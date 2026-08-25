type HeaderProps = {
  title: string
  subtitle?: string
}

function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {title}
          </h1>

          {subtitle && (
            <p className="hidden text-xs text-gray-500 sm:block">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Account
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
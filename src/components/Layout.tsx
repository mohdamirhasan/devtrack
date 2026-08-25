import Header from './Header'
import Sidebar from './Sidebar'

type LayoutProps = {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="DevTrack"
        subtitle="Project management for development teams."
      />

      <div className="flex">
        <Sidebar />

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
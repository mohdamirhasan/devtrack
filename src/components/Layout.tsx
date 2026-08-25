import Header from './Header'
import Sidebar from './Sidebar'

type LayoutProps = {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header
        title="DevTrack"
        subtitle="Project management for development teams."
      />

      <div>
        <Sidebar />

        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
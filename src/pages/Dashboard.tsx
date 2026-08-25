import StatCard from '../components/StatCard'

function Dashboard() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h2>

        <p className="mt-2 text-gray-500">
          Here's what's happening with your projects.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Projects"
          value={12}
          description="3 active projects"
        />

        <StatCard
          title="Active Tasks"
          value={48}
          description="8 due this week"
        />

        <StatCard
          title="Team Members"
          value={8}
          description="2 members joined this month"
        />
      </section>
    </div>
  )
}

export default Dashboard

export default function Dashboard() {
  const stats = [
    { label: "Total forms", value: "12", delta: "+3 this month", icon: "FileDescription" },
    { label: "Total submissions", value: "1,482", delta: "+218 this week", icon: "Send" },
    { label: "Total views", value: "6,310", delta: "+540 this week", icon: "Eye" },
    { label: "Avg. completion", value: "68%", delta: "+4% vs last month", icon: "ChartPie" },
  ];

  const recentForms = [
    { name: "Customer feedback survey", updatedAt: "2 days ago", submissions: 342, views: 1240, published: true },
    { name: "Job application form", updatedAt: "5 days ago", submissions: 89, views: 408, published: true },
    { name: "Product waitlist", updatedAt: "today", submissions: 0, views: 0, published: false },
  ];

  return (
    <div
      className="min-h-screen p-8 relative overflow-hidden"
      style={{
        backgroundColor: "#0f0f0f",
        backgroundImage: "radial-gradient(circle, #c2410c22 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* Ambient glow overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 70% 20%, #c2410c18 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 10% 80%, #c2410c10 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-stone-100">Dashboard</h1>
          <p className="text-sm text-stone-500 mt-1">Welcome back, Aryan</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-700 hover:bg-orange-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <span>+</span> New form
        </button>
      </div>

      {/* Stats grid */}
      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 backdrop-blur-sm"
            style={{
              backgroundColor: "#1c1917cc",
              border: "0.5px solid #c2410c30",
            }}
          >
            <p className="text-xs text-stone-500 mb-1.5">{stat.label}</p>
            <p className="text-3xl font-medium text-stone-100 leading-none">{stat.value}</p>
            <p className="text-xs text-green-400 mt-2">↑ {stat.delta}</p>
          </div>
        ))}
      </div>

      {/* Recent forms */}
      <div className="relative">
        <p className="text-xs font-medium text-stone-400 tracking-wide mb-3">Recent forms</p>
        <div className="space-y-2">
          {recentForms.map((form) => (
            <div
              key={form.name}
              className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors backdrop-blur-sm"
              style={{
                backgroundColor: "#1c1917bb",
                border: "0.5px solid #292524",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor = "#c2410c55")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor = "#292524")
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${form.published ? "bg-green-400" : "bg-stone-500"}`}
                />
                <div>
                  <p className="text-sm font-medium text-stone-300">{form.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">Updated {form.updatedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-stone-400">
                  ↑ {form.submissions.toLocaleString()} submissions
                </span>
                <span className="text-xs text-stone-400">
                  👁 {form.views.toLocaleString()} views
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    form.published
                      ? "bg-green-950 text-green-400 border border-green-900"
                      : "bg-stone-900 text-stone-500 border border-stone-800"
                  }`}
                >
                  {form.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
"use client";

export default function HistoryPage() {
  // Data history hardcode dulu untuk testing
  const history = [
    {
      id: 1,
      title: "News: World Economy Update",
      date: "2025-09-15T12:00:00Z",
    },
    {
      id: 2,
      title: "Science: AI Breakthrough in 2025",
      date: "2025-09-10T09:30:00Z",
    },
    {
      id: 3,
      title: "Politics: New Policy Announcement",
      date: "2025-09-05T15:45:00Z",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">History</h1>

        {history.length === 0 ? (
          <p className="text-gray-500 text-center">No history available.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {history.map((item) => (
              <li key={item.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button className="text-blue-600 hover:underline text-sm">
                  View
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <a
            href="/profile"
            className="w-full inline-block text-center py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Back to Profile
          </a>
        </div>
      </div>
    </div>
  );
}

import type { IconType } from 'react-icons'
import { FaUserFriends, FaHistory, FaBookmark, FaChevronRight } from 'react-icons/fa'

type Shortcut = {
  label: string
  icon: IconType
  color: string // gradient used behind the icon
}

const shortcuts: Shortcut[] = [
  { label: 'Friends', icon: FaUserFriends, color: 'from-sky-500 to-indigo-600' },
  { label: 'Memories', icon: FaHistory, color: 'from-fuchsia-500 to-purple-600' },
  { label: 'Bookmarks', icon: FaBookmark, color: 'from-pink-500 to-rose-500' },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:block sticky top-24 self-start animate-fade-up">
      <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-lg shadow-indigo-100">
        <h2 className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          Shortcuts
        </h2>

        <ul className="flex flex-col gap-1">
          {shortcuts.map(({ label, icon: Icon, color }, index) => (
            <li
              key={label}
              className="animate-fade-up"
              style={{ animationDelay: `${150 + index * 100}ms` }}
            >
              <button
                type="button"
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 text-start transition-all duration-300 hover:translate-x-1 hover:bg-indigo-50"
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <Icon className="size-4" />
                </span>

                <span className="flex-1 font-semibold text-slate-700 transition-colors group-hover:text-indigo-600">
                  {label}
                </span>

                <FaChevronRight className="size-3 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

/** Horizontal version of the shortcuts, shown on small screens only. */
export function MobileShortcuts() {
  return (
    <div className="lg:hidden mb-4 flex gap-3 overflow-x-auto pb-1 animate-fade-up">
      {shortcuts.map(({ label, icon: Icon, color }) => (
        <button
          key={label}
          type="button"
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-indigo-100 bg-white py-1.5 pe-4 ps-1.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <span
            className={`flex size-8 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white`}
          >
            <Icon className="size-3.5" />
          </span>
          {label}
        </button>
      ))}
    </div>
  )
}

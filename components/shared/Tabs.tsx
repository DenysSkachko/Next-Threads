'use client'
import { ReactNode, useState } from 'react'

interface TabItem {
  label: string
  content: ReactNode
  count?: number
}

interface TabsProps {
  defaultTab?: string
  tabs: TabItem[]
}

export default function Tabs({ defaultTab, tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].label)

  return (
    <div className="mt-9">
      <div className="flex justify-between">
        {tabs.map(tab => (
          <button
            key={tab.label}
            className={`px-4 py-2 flex-1 font-medium ${
              activeTab === tab.label ? 'bg-light-1 rounded-t-2xl' : 'text-light-1'
            }`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}{' '}
            <span
              className={`${activeTab === tab.label ? 'bg-primary-500' : 'text-light-1'}`}
            >
              {' '}
              {tab.count !== undefined && `(${tab.count})`}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tabs.map(tab => activeTab === tab.label && <div key={tab.label}>{tab.content}</div>)}
      </div>
    </div>
  )
}

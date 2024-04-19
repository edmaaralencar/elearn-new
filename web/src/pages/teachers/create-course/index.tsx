import { useState } from 'react'
import { CreateCourseSidebar } from './create-course-sidebar'
import { GeneralSection } from './general-section'
import { ChaptersSection } from './chapters-section'

export type Section = 'general' | 'chapters' | 'pricing' | 'images'

export function CreateCourse() {
  const [selectedSection, setSelectedSection] = useState<Section>('general')

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Criação de curso</h1>
        <span className="text-muted-foreground text-sm">
          Seções completadas (0/4)
        </span>
      </header>

      <div className="flex gap-8 items-start">
        <CreateCourseSidebar
          onSelectSection={setSelectedSection}
          selectedSection={selectedSection}
        />
        <div className="border border-muted w-full p-5 rounded-md">
          {selectedSection === 'general' && <GeneralSection />}
          {selectedSection === 'chapters' && <ChaptersSection />}
        </div>
      </div>
    </div>
  )
}

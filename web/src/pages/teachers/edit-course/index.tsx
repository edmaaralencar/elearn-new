import { useState } from 'react'
import { Sidebar } from './sidebar'
import { GeneralSection } from './general-section'
import { useParams } from 'react-router-dom'
import { useCourse } from '@/api/hooks/use-course'
import { Loading } from '@/components/ui/loading'
import { LessonsSection } from './lessons-section'
import { CreateLessonSection } from './create-lesson-section'
import { EditCourseHeader } from './edit-course-header'
import { ModulesSection } from './modules-section'

export type Section = 'general' | 'lessons' | 'create-lesson' | 'modules'

export function EditCourse() {
  const params = useParams()
  const [selectedSection, setSelectedSection] = useState<Section>('general')

  const { data } = useCourse(params.id ?? '')

  console.log(data)

  return (
    <div className="flex flex-col gap-8">
      {!data ? (
        <Loading />
      ) : (
        <EditCourseHeader
          modules={data.modules}
          course={data.course}
          lessons={data.lessons}
        />
      )}

      <div className="flex gap-6 items-start">
        <Sidebar
          onSelectSection={setSelectedSection}
          selectedSection={selectedSection}
        />

        {!data && (
          <div className="border border-muted w-full rounded-md grid place-items-center h-56">
            <Loading />
          </div>
        )}

        {data && (
          <div className="border border-muted w-full p-5 rounded-md">
            {selectedSection === 'general' && (
              <GeneralSection
                initialData={{
                  description: data.course?.description,
                  title: data.course.title,
                  id: String(params.id)
                }}
              />
            )}
            {selectedSection === 'lessons' && (
              <LessonsSection
                onSelectSection={setSelectedSection}
                initialData={{ lessons: data.lessons, modules: data.modules }}
              />
            )}

            {selectedSection === 'create-lesson' && (
              <CreateLessonSection
                modules={data.modules}
                onSelectSection={setSelectedSection}
              />
            )}

            {selectedSection === 'modules' && (
              <ModulesSection
                initialData={{
                  modules: data.modules.map((item, index) => ({
                    ...item,
                    position: index
                  }))
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

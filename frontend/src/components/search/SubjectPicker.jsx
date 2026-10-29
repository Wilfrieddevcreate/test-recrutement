import Chip from '../ui/Chip'

export default function SubjectPicker({ subjects, value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Matière">
      {subjects.map((subject) => (
        <Chip
          key={subject.id}
          role="radio"
          aria-checked={value === subject.id}
          selected={value === subject.id}
          onClick={() => onChange(subject.id)}
          className="justify-center text-center"
        >
          {subject.name}
        </Chip>
      ))}
    </div>
  )
}

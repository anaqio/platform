import { Input } from '@anaqio/ui'
import { Label } from '@anaqio/ui'

type AuthFieldProps = {
  id: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  value: string
  onChange: (value: string) => void
}

export function AuthField({
  id,
  label,
  type = 'text',
  placeholder,
  required,
  value,
  onChange,
}: AuthFieldProps) {
  return (
    <div className="grid gap-2">
      <Label
        htmlFor={id}
        className="font-body text-xs uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-white/10 bg-background/50"
      />
    </div>
  )
}

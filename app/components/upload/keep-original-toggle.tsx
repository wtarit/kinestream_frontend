export function KeepOriginalToggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="label cursor-pointer justify-start gap-3">
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="label-text">Keep original video after transcoding</span>
    </label>
  );
}

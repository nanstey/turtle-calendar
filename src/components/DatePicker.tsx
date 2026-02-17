import { useRef } from 'react';
import { formatIsoDate, parseIsoDate } from '../lib/dateUtils';

type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  onToday: () => void;
};

export function DatePicker({ value, onChange, onToday }: DatePickerProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (valueIso: string): void => {
    const parsed = parseIsoDate(valueIso);
    if (parsed) {
      onChange(parsed);
    }
  };

  const openNativePicker = (): void => {
    const input = inputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    input?.showPicker?.();
    input?.focus();
  };

  return (
    <div className="date-picker-wrap">
      <label htmlFor="calendar-date" className="date-picker-label">
        Explore a date
      </label>

      <div className="date-picker-row">
        <input
          ref={inputRef}
          id="calendar-date"
          className="date-picker-input"
          type="date"
          value={formatIsoDate(value)}
          onChange={(event) => handleInputChange(event.target.value)}
          onClick={openNativePicker}
        />

        <button type="button" className="date-picker-btn secondary" onClick={onToday}>
          Today
        </button>
      </div>
    </div>
  );
}

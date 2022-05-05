type OptionId = string | number;

interface SelectOption<T extends OptionId> {
  id: T;
  label: string;
}

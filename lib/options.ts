type OptionMeta = {
  label: string;
  [key: string]: unknown;
};

type EnumLike = Record<string, string>;
type ConfigLike = Record<string, OptionMeta>;
type ConfigKey<C extends ConfigLike> = Extract<keyof C, string>;
type OptionFromConfig<C extends ConfigLike, K extends ConfigKey<C>> = Omit<C[K], 'value'> & {
  value: K;
  label: C[K]['label'];
};

interface ParseFn<V extends string> {
  (val: unknown): V | undefined;
  <F extends V>(val: unknown, fallback: F): V;
}

export function createEnumOptionsHelper<const C extends ConfigLike>(
  config: C,
): {
  options: {
    [K in ConfigKey<C>]: OptionFromConfig<C, K>;
  }[ConfigKey<C>][];
  labelMap: { [K in keyof C]: C[K]['label'] };
  isValue: (val: unknown) => val is ConfigKey<C>;
  parse: ParseFn<ConfigKey<C>>;
  // ✅ Overloads: biết key → trả C[K], không biết → trả C[keyof C] | undefined
  getConfig: {
    <K extends ConfigKey<C>>(key: K): C[K];
    (key: unknown): C[ConfigKey<C>] | undefined;
  };
  getLabel: (val?: string | null, fallback?: string) => string;
  values: ConfigKey<C>[];
  config: C;
  enum: { [K in ConfigKey<C>]: K };
};

// Implementation
export function createEnumOptionsHelper(arg1: EnumLike | ConfigLike, arg2?: ConfigLike) {
  const enumMap = arg2
    ? (arg1 as EnumLike)
    : Object.fromEntries(Object.keys(arg1).map((key) => [key, key]));

  const config = (arg2 ?? arg1) as ConfigLike;

  const values = Object.values(enumMap);
  const valueSet = new Set(values);

  const options = values.map((value) => ({
    ...config[value],
    value,
    label: config[value]?.label ?? value,
    icon: config[value]?.icon ?? undefined,
  }));

  const labelMap = Object.fromEntries(options.map((o) => [o.value, o.label])) as Record<
    string,
    string
  >;

  const isValue = (val: unknown): val is string => typeof val === 'string' && valueSet.has(val);

  const parse = ((val: unknown, fallback?: string) =>
    isValue(val) ? val : fallback) as ParseFn<string>;

  const getConfig = ((val: unknown) => {
    const parsed = parse(val);
    return parsed != null ? config[parsed] : undefined;
  }) as {
    <K extends string>(key: K): ConfigLike[K];
    (key: unknown): ConfigLike[string] | undefined;
  };

  const getLabel = (val?: string | null, fallback = 'Không xác định') =>
    val != null && val in labelMap ? labelMap[val] : fallback;

  return {
    enum: enumMap,
    config,
    options,
    labelMap,
    isValue,
    parse,
    getConfig,
    getLabel,
    values,
  };
}

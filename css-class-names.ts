type CssClassNames = 'red' | 'green' | 'blue';

export const cn = (
  ...args: (Partial<Record<CssClassNames, boolean>> | CssClassNames)[]
) =>
  args
    .reduce(
      (acc, arg) =>
        acc.concat(
          typeof arg === 'object'
            ? Object.entries(arg)
                .filter(e => e[1])
                .map(e => e[0])
            : arg
        ),
      []
    )
    .join(' ');

cn('blue', { red: true, green: false }); // 'blue red'

export type Unreliable<T> = { [P in keyof T]?: Unreliable<T[P]> } | undefined;

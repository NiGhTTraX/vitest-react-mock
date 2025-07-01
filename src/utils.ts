import type { JestAssertionError } from 'expect';
import { expect } from 'expect';
import type { ReactMock } from 'react-mock-component';

export type UnknownProps = Record<string, unknown>;

export type DeepPartial<T> = T extends UnknownProps
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

export type IndexedRender<Props> = [number, Props];

/**
 * Recursively diff props, returning only the properties that differ.
 */
export function diffProps<Props extends UnknownProps>(
  actual: Props,
  expected: DeepPartial<Props>,
): string {
  try {
    expect(actual).toMatchObject(expected);

    return '';
  } catch (e) {
    // The error message will look like this:
    // Error: expect(received).toMatchObject(expected)
    //
    // - Expected - 1
    // + Received + 1
    //
    //   Object {
    //   "a": 1,
    // -   "b": 3,
    // +   "b": 2,
    //     }
    return (e as JestAssertionError).message.split('\n').slice(5).join('\n');
  }
}

/**
 * Recursively match props.
 */
export function deepEquals<Props extends UnknownProps>(
  received: Props,
  expected: DeepPartial<Props>,
): boolean {
  try {
    // expect in expect, yeah.
    expect(received).toMatchObject(expected);

    return true;
  } catch (e) {
    return false;
  }
}

export function getMatchingCalls<Props extends UnknownProps>(
  mock: ReactMock<Props>,
  expected: DeepPartial<Props>,
): IndexedRender<Props>[] {
  const matchingCalls: IndexedRender<Props>[] = [];

  mock.renderCalls.forEach((received, i) => {
    if (deepEquals(received, expected)) {
      matchingCalls.push([i, received]);
    }
  });

  return matchingCalls;
}

export const printCall =
  <Props>(
    expected: DeepPartial<Props>,
    printRender: (actual: Props, expected: DeepPartial<Props>) => string,
  ) =>
  ([i, received]: IndexedRender<Props>) =>
    `Render ${i}:${printRender(received, expected)}`;

const indentation = `    `;

export const indent = (s: string) =>
  `${indentation}${s.split('\n').join(`\n${indentation}`)}`;

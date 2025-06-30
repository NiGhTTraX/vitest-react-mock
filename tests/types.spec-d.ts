import createReactMock from 'react-mock-component';
import { describe, expect, expectTypeOf, it } from 'vitest';
import '../src';

describe('types', () => {
  const Mock = createReactMock<{ foo: string }>();

  it('should not extend matchers for non-mocks', () => {
    expectTypeOf(expect(1)).not.toHaveProperty('toBeMounted');
    expectTypeOf(expect(1).not).not.toHaveProperty('toBeMounted');
  });

  it('should extend matchers for mocks', () => {
    expectTypeOf(expect(Mock)).toHaveProperty('toBeMounted');
    expectTypeOf(expect(Mock).not).toHaveProperty('toBeMounted');
  });

  it('should partial the props', () => {
    expectTypeOf(expect(Mock).toHaveBeenRenderedWith)
      .parameter(0)
      .toEqualTypeOf<{ foo?: string }>();
  });
});

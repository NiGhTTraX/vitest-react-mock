<!--suppress HtmlDeprecatedAttribute -->
<div align="center">
<h2><a href="https://vitest.dev/">vitest</a> matcher for <a href="https://github.com/NiGhTTraX/react-mock-component">react-mock-component</a></h2>

![Build Status](https://github.com/NiGhTTraX/vitest-react-mock/workflows/Tests/badge.svg) [![codecov](https://codecov.io/gh/NiGhTTraX/vitest-react-mock/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/vitest-react-mock) ![npm type definitions](https://img.shields.io/npm/types/mugshot.svg)
</div>

----

## Installation

```sh
npm i -D vitest-react-mock
```


## Setup

In your test setup:

```typescript
import 'vitest-react-mock';
```

## Usage

This package extends vitest's [expect](https://vitest.dev/api/expect.html) with the matchers below. 

### `toBeMounted`

Checks that a mock component is currently mounted.

```typescript jsx
import createReactMock from 'react-mock-component';
import React from 'react';
import {render, unmount} from 'react-dom';

const Mock = createReactMock();

expect(Mock).not.toBeMounted();
render(<Mock />);
expect(Mock).toBeMounted();
unmount();
expect(Mock).not.toBeMounted();
```

### `toHaveBeenRendered()`

Checks that a mock component has been rendered at least once.

```typescript jsx
import createReactMock from 'react-mock-component';
import React from 'react';
import {render} from 'react-dom';

const Mock = createReactMock();

expect(Mock).not.toHaveBeenRendered();

render(<Mock />);

expect(Mock).toHaveBeenRendered();
```

This is slightly different from `toBeMounted`: if the component gets unmounted `toBeMounted` will throw whereas `toHaveBeenRendered` will continue to pass.

### `toHaveBeenRenderedWith(props)`

Checks that a mock component has been rendered with the expected props at least once. If you want to check only the last render then use [`toHaveProps`](#tohavepropsprops).
You can pass a subset of the props and they will be deeply matched against the received ones.


```typescript jsx
import createReactMock from 'react-mock-component';
import React from 'react';
import {render} from 'react-dom';

const Mock = createReactMock<{ foo: string, bar: number }>();

render(<Mock foo="bar" bar={42} />);

expect(Mock).toHaveBeenRenderedWith({ foo: 'bar' });
```

### `toHaveProps(props)`

Checks that a mock component's last received props match the expected ones. If you want the check all renders and not just the last one then use [`toHaveBeenRenderedWith`](#tohavebeenrenderedwithprops). 
You can pass a subset of the props and they will be deeply matched against the received ones.


```typescript jsx
import createReactMock from 'react-mock-component';
import React from 'react';
import {render} from 'react-dom';

const Mock = createReactMock<{ foo: string, bar: number }>();

render(<Mock foo="bar" bar={42} />);

expect(Mock).toHaveProps({ foo: 'bar' });
```

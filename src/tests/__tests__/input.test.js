import { expect, test } from '@jest/globals';
import { render, fireEvent, cleanup } from '@testing-library/react';

import Input from 'app/components/input';

const defaultProps = {
  value: 'Hey!',
  onChange: jest.fn(value => value),
  'data-testid': 'input-id',
};

afterEach(cleanup);

test('check setting up default value to input', async () => {
  const { getByTestId } = render(
    <Input {...defaultProps}/>
  );

  const input = getByTestId(defaultProps['data-testid']);

  expect(input.value).toBe(defaultProps.value);
});

test('calls onChange with correct argument after input value', async () => {
  const { getByTestId } = render(
    <Input {...defaultProps}/>
  );

  const input = getByTestId(defaultProps['data-testid']);

  fireEvent.change(input, { target: { value: 'rainbow' } });
  expect(defaultProps.onChange).toHaveBeenCalledWith('rainbow');
});

test('check if border added on input focus', async () => {
  const { getByTestId, container } = render(
    <Input {...defaultProps}/>
  );

  const input = getByTestId(defaultProps['data-testid']);

  input.focus();
  expect(container.firstChild.classList).toContain('input_focused');

  input.blur();
  expect(container.firstChild.classList.contains('input_focused')).toBe(false);
});

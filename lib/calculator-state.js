/**
 * Applies an input change while invalidating output derived from old inputs.
 * Field errors remain visible until the next calculation; a calculation-level
 * error is cleared because it may no longer describe the edited inputs.
 */
export function changeCalculationInput(state, key, value) {
  const { form, ...fieldErrors } = state.errors
  return {
    values: { ...state.values, [key]: value },
    errors: fieldErrors,
    answer: null,
  }
}


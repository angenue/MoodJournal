import { errorMessage, successMessage } from './toastMessage';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: Object.assign(jest.fn(), {
    error: jest.fn(),
    success: jest.fn(), 
  }),
}));

describe('toastMessage', () => {
  beforeEach(() => {
    (toast as unknown as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  it('displays an error message when errorMessage is called', () => {
    const testError = 'Test Error Message';
    errorMessage(testError);
    expect(toast.error).toHaveBeenCalledWith(testError, expect.any(Object));
  });

  it('displays a success message when successMessage is called', () => {
    const testSuccess = 'Test Success Message';
    successMessage(testSuccess);
    expect(toast).toHaveBeenCalledWith(testSuccess, expect.any(Object));
  });
});

interface FormData {
    mood: string | null;
    journalEntry: string;
    // Add other properties if needed
  }

const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch('/api/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Error submitting form');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting form', error);
      throw error; // Re-throw the error for the calling code to handle
    }
  };
  
  export default handleSubmit;
  
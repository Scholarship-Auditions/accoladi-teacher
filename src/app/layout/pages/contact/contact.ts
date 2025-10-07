import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {

  formData: ContactFormData = {
    name: '',
    email: '',
    message: ''
  };

  isSubmitting = false;
  isSubmitted = false;

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', this.formData);
      this.isSubmitted = true;
      this.isSubmitting = false;
      
      // Reset form after successful submission
      this.formData = {
        name: '',
        email: '',
        message: ''
      };
      
      // Show success message (you can implement a toast notification here)
      alert('Thank you for your message! We\'ll get back to you soon.');
    }, 2000);
  }
}

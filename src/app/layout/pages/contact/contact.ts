import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./contact.html",
  styleUrls: ["./contact.scss"],
})
export class Contact {
  formData = {
    name: "",
    email: "",
    message: "",
  };

  // File Upload State
  selectedFiles: File[] = [];
  isDragOver = false;

  // Submission State
  isSubmitting = false;
  showSuccess = false;
  errorMessage = "";

  constructor(private http: HttpClient) {}

  // --- File Upload Methods ---

  triggerFileUpload() {
    const fileInput = document.getElementById("attachment") as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    this.handleFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  handleFiles(files: FileList) {
    const maxBytes = 5 * 1024 * 1024; // 5MB limit

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxBytes) {
        alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
        continue;
      }
      // Avoid duplicates
      if (!this.selectedFiles.some((f) => f.name === file.name)) {
        this.selectedFiles.push(file);
      }
    }
  }

  removeFile(index: number, event: Event) {
    event.stopPropagation();
    this.selectedFiles.splice(index, 1);
  }

  getFileSize(size: number): string {
    if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " KB";
    }
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }

  // --- Submission ---

  onSubmit(form: NgForm): void {
    if (form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = "";

    const apiData = new FormData();
    apiData.append("contactName", this.formData.name);
    apiData.append("contactEmail", this.formData.email);
    apiData.append("description", this.formData.message);

    // Append all selected files
    this.selectedFiles.forEach((file) => {
      apiData.append("attachment", file);
    });

    const apiUrl = "https://platform.accoladi.com/api/support/tickets/";

    this.http.post(apiUrl, apiData).subscribe({
      next: (response) => {
        console.log("Success:", response);
        this.isSubmitting = false;
        this.showSuccess = true;
        this.selectedFiles = []; // Clear files
        this.formData = { name: "", email: "", message: "" }; // Clear text
        form.resetForm();

        setTimeout(() => {
          this.showSuccess = false;
        }, 5000);
      },
      error: (error) => {
        console.error("Error:", error);
        this.isSubmitting = false;
        this.errorMessage =
          error.error?.message || "Something went wrong. Please try again.";
      },
    });
  }
}

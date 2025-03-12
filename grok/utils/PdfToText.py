import os
import fitz  # PyMuPDF
import argparse
from pathlib import Path


def parse_pdf(pdf_path):
    """
    Parse a PDF file and extract text from each page.
    
    Args:
        pdf_path (str): Path to the PDF file
    
    Returns:
        list: List of strings, each containing text from a page
    """
    # Expand home directory if path starts with ~
    if pdf_path.startswith('~'):
        pdf_path = os.path.expanduser(pdf_path)
    
    print(f"Attempting to read PDF at: {pdf_path}")
    
    # Check if file exists
    if not os.path.exists(pdf_path):
        print(f"File does not exist: {pdf_path}")
        return []
    
    try:
        # Open the PDF file
        doc = fitz.open(pdf_path)
        print(f"Successfully opened PDF with {len(doc)} pages")
        
        # Extract text from each page
        page_texts = []
        for i, page in enumerate(doc):
            text = page.get_text()
            page_texts.append(text)
            print(f"Extracted text from page {i+1} ({len(text)} characters)")
        
        # Create output directory
        output_dir = Path(pdf_path.split("/")[-1].split(".")[0] + "_output")
        output_dir.mkdir(exist_ok=True)
        
        # Save text from each page
        for i, text in enumerate(page_texts):
            output_file = output_dir / f"page_{i+1}.txt"
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(text)
        
        # Save full text
        full_text = "\n\n".join(page_texts)
        with open(output_dir / "full_text.txt", "w", encoding="utf-8") as f:
            f.write(full_text)
        
        print(f"Text saved to {output_dir} directory")
        return page_texts
        
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return []


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract text from PDF files")
    parser.add_argument("pdf_path", help="Path to the PDF file")
    args = parser.parse_args()
    
    page_texts = parse_pdf(args.pdf_path)
    
    if page_texts:
        print("\nFirst 200 characters from each page:")
        for i, text in enumerate(page_texts):
            preview = text[:200] + "..." if len(text) > 200 else text
            print(f"\n--- Page {i+1} ---\n{preview}")